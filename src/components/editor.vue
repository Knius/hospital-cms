<template>
  <div class="tinymce-editor">
    <editor v-model="myValue" :init="init" :disabled="disabled"></editor>
  </div>
</template>
<script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver";
import "tinymce/icons/default/icons";
import "tinymce/skins/ui/oxide/skin.css";
// 编辑器插件plugins
import "tinymce/plugins/image"; // 插入上传图片插件
import "tinymce/plugins/media"; // 插入视频插件
import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/link"; // 链接插件
import "tinymce/plugins/wordcount"; // 字数统计插件

export default {
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //初始化配置
      init: {
        language_url: `./tinymce/langs/zh_CN.js`,
        language: "zh_CN",
        skin_url: `./tinymce/skins/ui/oxide`,
        content_css: `./tinymce/skins/content/default/content.css`,
        font_formats:
          "微软雅黑=Microsoft YaHei;宋体=simsun,serif;黑体=SimHei;仿宋=FangSong;楷体=KaiTi;Helvetica Neue=Helvetica Neue;sans-serif=sans-serif;苹果苹方=PingFang SC;",
        height: 300,
        plugins: `link image media table wordcount`,
        toolbar: [
          "undo redo | formatselect | bold italic fontselect forecolor backcolor | removeformat",
          `alignleft aligncenter alignright alignjustify | outdent indent | link image media table |`
        ],
        branding: false,
        menubar: false,
        // 上传base64化图片
        images_upload_handler: (blobInfo, success) => {
          const img = "data:image/jpeg;base64," + blobInfo.base64();
          success(img);
        }
      },
      myValue: this.value
    };
  },
  created() {
    this.registerTelPlugin();
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
    clear() {
      this.myValue = "";
    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .mce-content-body code {
  font-family: inherit;
}
</style>
<style lang="scss">
.tox-tinymce-aux {
  z-index: 3000;
}
</style>
