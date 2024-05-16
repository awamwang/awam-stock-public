import { Get, Post, Put, Delete, Req, Body, HttpCode } from '@nestjs/common'
import { Request } from 'express'

import { PlainDataModel, DefaultRequestQuery, REQUEST_BUILDIN_QUERYS, IRequestQuery, IStrNameMap, SortOptions, _ } from '@awamstock/shared'
export { DefaultRequestQuery, REQUEST_BUILDIN_QUERYS }
import { omitQuery } from '@awamstock/shared/util'
import { groupFirst, QUERYS, QueryName, PipelineProp } from '@awamstock/model'
import { FilterQuery, isValidObjectId, ProjectionFields, Expression, Model } from '@awamstock/model/mongoose'

export interface BasicControllerOptions<T extends PlainDataModel> {
  // model: Model<T>
  _sort?: SortOptions<IRequestQuery<T>>
  supportedGetParam: (keyof T)[]
  supportedListQuery: (keyof T)[]
  strNameMap?: IStrNameMap<T>
}

function getProjection<T extends PlainDataModel>(fields?: string): ProjectionFields<T> | undefined {
  if (!fields) {
    return undefined
  }

  const fieldList = fields.split(',').map((s) => s.trim())

  return fieldList.reduce(
    (acc, key) => ({
      ...acc,
      [key]: 1,
    }),
    { _id: 0 }
  )
}

export type DbQuery = Partial<PlainDataModel<string | PlainDataModel<string>>>

function parseAdvancedDbQuery<T extends PlainDataModel>(query: IRequestQuery<T>) {
  const dbQuery: DbQuery = {}

  // 支持~=模糊匹配
  Object.keys(query).forEach((key) => {
    const value = query[key]
    if (key.endsWith('~') && _.isString(value)) {
      dbQuery[key.slice(0, -1)] = { $regex: value as string }
    }
  })

  return dbQuery
}

function parseBuildinDbQuery<T extends PlainDataModel>(query: IRequestQuery<T> = {}, options: BasicControllerOptions<T>) {
  const dbQuery: DbQuery = {}

  // const { _limit, _sort, _noStrNameMap = false, _aggregate, _groupFirst, _fields } = _.assign(DefaultRequestQuery, options, query)
  const { _limit, _sort, _noStrNameMap = false, _aggregate, _groupFirst, _fields } = _.defaults(query, options, DefaultRequestQuery)

  return {
    ...dbQuery,
    limit: Number.parseInt(_limit.toString(), 10),
    sort: _sort, // 默认时间倒序
    project: getProjection<T>(_fields),
    aggregate: _aggregate as QueryName,
    groupFirstBy: _groupFirst,
    noStrNameMap: !!_noStrNameMap,
    strNameMap: _noStrNameMap ? undefined : options.strNameMap,
  }
}

function parseDbQuery<T extends PlainDataModel>(query: IRequestQuery<T> = {}, options: BasicControllerOptions<T>) {
  const dbQuery: DbQuery = { ...query, ...parseAdvancedDbQuery<T>(query) }
  const buildinDbQuery = parseBuildinDbQuery(query, options)

  if (query._start || query._end) {
    dbQuery['date'] = { $gte: query._start as string, $lte: query._end as string }
  }

  REQUEST_BUILDIN_QUERYS.forEach((key) => {
    delete dbQuery[key]
  })

  return {
    query: dbQuery as FilterQuery<T>,
    buildinDbQuery: buildinDbQuery,
  }
}

export class BasicController<T extends PlainDataModel> {
  protected options: BasicControllerOptions<T> = {
    supportedGetParam: [],
    supportedListQuery: [],
  }
  extraListQuery?: FilterQuery<T>

  constructor(protected readonly model: Model<T>, options: Partial<BasicControllerOptions<T>> = {}) {
    this.checkOptions(options)
  }
  // constructor(protected readonly modelName: string, options: Partial<BasicControllerOptions<T>> = {}) {
  //   this.checkOptions(options)
  // }

  protected checkOptions(options: Partial<BasicControllerOptions<T>> = {}) {
    this.options = _.assign(this.options, options)
    const { supportedGetParam, supportedListQuery } = this.options

    if (REQUEST_BUILDIN_QUERYS.some((p) => supportedGetParam.includes(p))) {
      throw new Error(`${REQUEST_BUILDIN_QUERYS} is a reserved query, but list in supportedGetParam`)
    }
    if (REQUEST_BUILDIN_QUERYS.some((p) => supportedListQuery.includes(p))) {
      throw new Error(`${REQUEST_BUILDIN_QUERYS} is a reserved query, but list in supportedListQuery`)
    }
  }

  protected parseDbQuery(query: IRequestQuery<T>) {
    return parseDbQuery<T>(query, this.options)
  }

  /**
   * 默认list类型查询
   */
  @Get()
  public async list(@Req() req: Request) {
    const { query: parsedDbQuery, buildinDbQuery } = this.parseDbQuery(req.query as IRequestQuery<T>)
    const { limit, sort, strNameMap, aggregate, groupFirstBy, project } = buildinDbQuery

    const dbQuery = omitQuery<FilterQuery<T>>(
      {
        ...this.extraListQuery,
        ...parsedDbQuery,
      },
      this.options.supportedListQuery
    )
    let res: T[]
    // console.log('dbQuery', req.path, dbQuery, buildinDbQuery)

    if (aggregate) {
      // 请求定制的聚合数据
      res = await this.model
        .aggregate(QUERYS.longhuQuery(dbQuery as PipelineProp<T>, { project }))
        .sort(sort)
        .limit(limit)
    } else if (groupFirstBy) {
      // 请求group后的数据，把每个group的第一条数据拿出来
      res = await this.model.aggregate(groupFirst(dbQuery, { groupFirstBy, project })).sort(sort).limit(limit)
    } else {
      // 普通的查询
      res = await this.model.find(dbQuery, project).sort(sort).limit(limit)
    }

    return {
      data: res,
      strNameMap,
    }
  }

  /**
   * 默认get类型查询
   */
  @Get(':id')
  public async getOne(@Req() req: Request) {
    // const { ctx } = this
    // const { helper, model } = ctx

    const { query: parsedDbQuery, buildinDbQuery } = this.parseDbQuery(req.query as IRequestQuery<T>)
    const { sort, strNameMap, project } = buildinDbQuery
    let { supportedGetParam } = this.options

    const _id = req.params.id || ''
    if (!isValidObjectId(_id)) {
      // 如果_id不是一个有效的ObjectId，就不能查询_id
      supportedGetParam = _.dropWhile(supportedGetParam, (key) => key === '_id')
    }

    const dbQuery = {
      ...parsedDbQuery,
      ...(<FilterQuery<T>>(supportedGetParam.length ? { $or: supportedGetParam.map((key) => ({ [key]: _id })) } : { _id })),
    }
    // console.log('dbQuery', _id, isValidObjectId(_id), supportedGetParam, dbQuery, project, sort)

    return {
      data: await this.model.findOne(dbQuery, project).sort(sort),
      strNameMap,
    }
  }
}

export class CrudController<T extends PlainDataModel> extends BasicController<T> {
  @Post()
  @HttpCode(201)
  public async post(@Req() req: Request, @Body() body: T[]) {
    const { project } = this.parseDbQuery(req.query as IRequestQuery<T>).buildinDbQuery
  }

  @Post(':id')
  @HttpCode(201)
  public async postOne(@Req() req: Request, @Body() body: T) {
    const { project } = this.parseDbQuery(req.query as IRequestQuery<T>).buildinDbQuery
  }

  @Put(':id')
  @HttpCode(201)
  public async putOne(@Req() req: Request, @Body() body: T) {
    const { project } = this.parseDbQuery(req.query as IRequestQuery<T>).buildinDbQuery
  }

  @Delete()
  @HttpCode(204)
  public async delete(@Req() req: Request) {
    const { project } = this.parseDbQuery(req.query as IRequestQuery<T>).buildinDbQuery
  }

  @Delete(':id')
  @HttpCode(204)
  public async deleteOne(@Req() req: Request) {
    const { project } = this.parseDbQuery(req.query as IRequestQuery<T>).buildinDbQuery
  }
}
