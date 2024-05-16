import akshare as ak

# 北向数据
# stock_hsgt_north_net_flow_in_em_df = ak.stock_hsgt_north_net_flow_in_em(symbol="北上")
# print(stock_hsgt_north_net_flow_in_em_df)

# 个股实时
stock_zh_a_spot_em_df = ak.stock_zh_a_spot_em()
print(stock_zh_a_spot_em_df)

# 个股资金流向
stock_fund_flow_individual_df = ak.stock_fund_flow_individual(symbol="即时")
print(stock_fund_flow_individual_df)

# 大单追踪
stock_fund_flow_big_deal_df = ak.stock_fund_flow_big_deal()
print(stock_fund_flow_big_deal_df)

