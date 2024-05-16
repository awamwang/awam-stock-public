<script setup lang="ts">
const menus = [
  { label: '盯盘', name: 'ding-pan' },
  { label: '竞价', name: 'before-open' },
  { label: '历史', name: 'history' },
  { label: '复盘', name: 'fu-pan' },
  { label: '笔记', name: 'note' },
]

const route = useRoute()
const router = useRouter()
const dingPan = useEnvironmentStore()
const activeName = ref(menus[0].name)
// const { currentDate } = toRefs(dingPan)

onMounted(() => {
  console.log(route.name)
  activeName.value = route.name as string
})

const onMenuSelect = (key: string, keyPath: string[]) => {
  if (route.name !== key) {
    router.push({ name: key })
  }
}
</script>

<template>
  <div class="board">
    <div class="title">
      <!-- <el-date-picker v-model="currentDate" type="date" placeholder="Pick a date" :default-value="dingPan.currentDate" /> -->
      <span class="date">{{ dingPan.dateToShow }}</span>
    </div>

    <el-menu :default-active="activeName" mode="horizontal" @select="onMenuSelect">
      <el-menu-item :index="menu.name" :key="menu.name" v-for="menu in menus">{{ menu.label }}</el-menu-item>
      <el-sub-menu index="setting">
        <template #title>配置</template>
        <el-menu-item index="setting/focusedDepartment">关注营业部</el-menu-item>
        <el-menu-item index="setting/stocksoft">股软相关设置</el-menu-item>
        <el-sub-menu index="setting/system">
          <template #title>系统</template>
          <el-menu-item index="setting/system/feature">功能</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
    </el-menu>

    <!-- <el-tabs type="border-card" v-model="activeName" @tab-change="onTabChange">
      <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name" v-for="tab in tabs"></el-tab-pane>
    </el-tabs> -->
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<style lang="scss">
.board {
  position: relative;
  background-color: white;
  height: 100%;
  border-radius: 6px;

  .title {
    position: fixed;
    width: 200px;
    top: 20px;
    right: 20px;
    z-index: 2;
    line-height: 39px;
    font-weight: bold;
    font-size: larger;

    .date {
      margin-right: 20px;
    }
  }

  .el-menu {
    .el-menu-item {
      line-height: 36px;
    }

    .el-sub-menu {
      .el-sub-menu__title {
        line-height: 36px;
      }
    }
  }

  .el-tabs {
    border-radius: 6px 6px 0 0;

    .el-tabs__header {
      padding: 0 20px;
      margin-bottom: 0;
    }

    .el-tabs__content {
      padding: 0;
    }
  }
}
</style>
