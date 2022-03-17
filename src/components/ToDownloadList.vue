<template>
  <div class="list-container">
    <el-table
      ref="tableList"
      height="100%"
      :data="props.data"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column width="60" type="index" label="序号" />
      <el-table-column prop="path" label="文件名" />
      <el-table-column width="80" label="完成进度">
        <template #default="{ row }">
          <!-- <el-icon v-show="row.loaded" :size="22" :color="'green'">
            <circle-check />
          </el-icon> -->
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="row.percent"
            status="success"
          ></el-progress>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { CircleCheck } from '@element-plus/icons-vue'
import { VideosResult } from 'index'
const props = defineProps<{ data: VideosResult[]; index: number }>()
const tableList = ref()
watch(
  () => props.index,
  (n) => {
    const scrollWrap = document.querySelector(
      '.el-scrollbar__wrap'
    ) as HTMLElement

    let top: number = 0
    const rows = scrollWrap.querySelectorAll('.el-table__row') as any
    for (let i = 0; i <= n; i++) {
      top += rows[i].offsetHeight
    }

    let _top: number = top - scrollWrap.offsetHeight

    console.log(_top, top, scrollWrap.offsetHeight);

    if (_top < 0) {
      _top = 0
    }
    scrollWrap.scrollTop = _top
  }
)
</script>

<style lang="scss">
.list-container {
  position: absolute;
  top: 286px;
  bottom: 0;
  left: 20px;
  right: 20px;
}
</style>
