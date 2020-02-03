 <template>
  <div>
    <h2 style="text-align:center">全国截止至{{date}}</h2>

    <van-row style="text-align:center" class="vantRow">
      <van-col span="6" class="vantCol" style="color:#ee0a24">确诊</van-col>
      <van-col span="6" class="vantCol" style="color:#ffd21e">疑似</van-col>
      <van-col span="6" class="vantCol" style="color:rgb(7, 193, 96)">治愈</van-col>
      <van-col span="6" class="vantCol">死亡</van-col>
    </van-row>
    <van-row style="text-align:center" class="vantRow">
      <van-col span="6" class="vantCol">{{data.diagnosed}}</van-col>
      <van-col span="6" class="vantCol">{{data.suspect}}</van-col>
      <van-col span="6" class="vantCol">{{data.cured}}</van-col>
      <van-col span="6" class="vantCol">{{data.death}}</van-col>
    </van-row>
    <h2 style="text-align:center">各省确诊分布情况</h2>
    <v-chart :options="polar" v-if="isShow" height="500px" />
     <h2 style="text-align:center">各省份详情</h2>
    <van-collapse v-model="activeNames">
      <van-collapse-item
        :label="'确诊' +item.confirmedCount"
        :value="item.comment"
        :title="item.provinceName+'确诊'"
        :name="index"
        v-for="(item,index) in area"
        :key="index"
      >
        <van-row style="text-align:center" class="vantRow" type="flex" justify="center">
             <van-col span="6" class="vantColSub"  style="color:#000">地名</van-col>
          <van-col span="6" class="vantColSub" style="color:#ee0a24">确诊</van-col>
          <!-- <van-col span="6" class="vantColSub" style="color:#ffd21e">疑似</van-col> -->
          <van-col span="6" class="vantColSub" style="color:rgb(7, 193, 96)">治愈</van-col>
          <van-col span="6" class="vantColSub">死亡</van-col>
        </van-row>
        <van-divider />
        <div v-for="(prop,i) in item.cities" :key="i"> 
            <van-row style="text-align:center" class="vantRow"  type="flex" justify="center">
          <van-col span="6" class="vantColSub" style="color:#000">{{prop.cityName}}</van-col>
          <van-col span="6" class="vantColSub" style="color:#ee0a24">{{prop.confirmedCount}}</van-col>
          <!-- <van-col span="6" class="vantColSub" style="color:#ffd21e">{{prop.suspectedCount}}</van-col> -->
          <van-col span="6" class="vantColSub" style="color:rgb(7, 193, 96)">{{prop.curedCount}}</van-col>
          <van-col span="6" class="vantColSub">{{prop.deadCount}}</van-col>
        </van-row>
        <!-- <hr> -->
        <van-divider />
        </div>
      </van-collapse-item>
    </van-collapse>
<h2 style="text-align:center">阿冠病毒历史信息</h2>
    <v-chart :options="sorss" v-if="isShow" />
  </div>
</template>

<style>
/**
 * The default size is 600px×400px, for responsive charts
 * you may need to set percentage values as follows (also
 * don't forget to provide a size for the container).
 */
.echarts {
  /* width: 100%;
  height: 100%; */
}
.vantCol {
  line-height: 40px;
  font-weight: 700;
  font-size:14px;
}
.vantColSub {
    font-size:14px;
  line-height: 20px;
}
</style>

<script>
import { Tab, Tabs, Col, Row, Collapse, CollapseItem,Divider } from "vant";
import chongqing from "./chongqing";
import corss from "./corss";
import { getMapDate } from "@/api/other.js";
import ECharts from "vue-echarts";
import "echarts/lib/chart/map";
import chinaMap from "./china.json";
var data, dataChina;
ECharts.registerMap("china", chinaMap);
export default {
  components: {
    "v-chart": ECharts,
    chongqing,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Col.name]: Col,
    [Row.name]: Row,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
     [Divider.name]: Divider
  },
  data() {
    let data = [];
    for (let i = 0; i <= 360; i++) {
      let t = (i / 180) * Math.PI;
      let r = Math.sin(2 * t) * Math.cos(2 * t);
      data.push([r, i]);
    }

    return {
      area: [],
      activeNames: [],
      date: "",
      data: {},
      active: "",
      isShow: false,
      dateList: [],
      polar: {
        title: {
          // text: "确诊人口分布",
          subtext: ""
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>{c} (人)"
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "center",
          top: "center",
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        visualMap: {
          min: 0,
          max: 10000,
          text: ["High", "Low"],
          realtime: false,
          calculable: true,
          inRange: {
            color: [
              "#ff0",
              "#900",
              "#a00",
              "#b00",
              "#c00",
              "#d00",
              "#e00",
              "#f00"
            ]
          }
        },
        series: [
          {
            name: "",
            type: "map",
            mapType: "china", // 自定义扩展图表类型
            label: {
              show: true
            },
            data: dataChina
            // data: [
            //     {name: '中西区', value: 20057.34},
            //     {name: '湾仔', value: 15477.48},
            //     {name: '东区', value: 31686.1},
            //     {name: '南区', value: 6992.6},
            //     {name: '油尖旺', value: 44045.49},
            //     {name: '深水埗', value: 40689.64},
            //     {name: '九龙城', value: 37659.78},
            //     {name: '黄大仙', value: 45180.97},
            //     {name: '观塘', value: 55204.26},
            //     {name: '葵青', value: 21900.9},
            //     {name: '荃湾', value: 4918.26},
            //     {name: '屯门', value: 5881.84},
            //     {name: '元朗', value: 4178.01},
            //     {name: '北区', value: 2227.92},
            //     {name: '大埔', value: 2180.98},
            //     {name: '沙田', value: 9172.94},
            //     {name: '西贡', value: 3368},
            //     {name: '离岛', value: 806.98}
            // ],
            // // 自定义名称映射
          }
        ]
      },
      sorss: {
        title: {
          text: ""
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          height: 200,
          height: 200,
          selectedMode: "single",
          data: ["确诊", "疑似", "治愈", "死亡"]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: [] //后面设置
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            itemStyle: { normal: { label: { show: true } } },
            name: "确诊",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            itemStyle: { normal: { label: { show: true } } },
            name: "疑似",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            itemStyle: { normal: { label: { show: true } } },
            name: "治愈",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            itemStyle: { normal: { label: { show: true } } },
            name: "死亡",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [320, 332, 301, 334, 390, 330, 320]
          }
        ]
      }
    };
  },
  methods: {},
  created() {
    getMapDate().then(res => {
      data = res.data.data;
      this.date = data.date;
      this.data = data;
      this.area = data.area;
      dataChina = res.data.data.list.map(item => {
        return {
          name: item.split(" ")[0],
          value: parseInt(item.split("确诊")[1].split("例")[0])
        };
      });

      this.polar.series[0].data = dataChina;
      let data1 = [];
      let data2 = [];
      let data3 = [];
      let data4 = [];
      this.dateList = res.data.data.history.reverse().map(item => {
        data1.push(item.confirmedNum);
        data2.push(item.suspectedNum);
        data3.push(item.curesNum);
        data4.push(item.deathsNum);
        return item.date;
      });
      this.sorss.xAxis[0].data = this.dateList;
      this.sorss.series[0].data = data1;
      this.sorss.series[1].data = data2;
      this.sorss.series[2].data = data3;
      this.sorss.series[3].data = data4;
      this.isShow = true;
    });
  }
};
</script>