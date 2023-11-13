import { h, cloneVNode, computed, defineComponent } from "vue";
import { omit } from "lodash-es";
import { twMerge, twJoin } from "tailwind-merge";
import { defuTwMerge, getSlotsChildren } from "../../utils/index.mjs";
import Avatar from "./Avatar.vue";
import { useAppConfig } from "#imports";
import appConfig from "#build/app.config";
export default defineComponent({
  inheritAttrs: false,
  props: {
    size: {
      type: String,
      default: null,
      validator(value) {
        return Object.keys(appConfig.ui.avatar.size).includes(value);
      }
    },
    max: {
      type: Number,
      default: null
    },
    ui: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { attrs, slots }) {
    const appConfig2 = useAppConfig();
    const ui = computed(() => defuTwMerge({}, props.ui, appConfig2.ui.avatarGroup));
    const children = computed(() => getSlotsChildren(slots));
    const max = computed(() => typeof props.max === "string" ? parseInt(props.max, 10) : props.max);
    const clones = computed(() => children.value.map((node, index) => {
      const vProps = {};
      if (!props.max || max.value && index < max.value) {
        if (props.size) {
          vProps.size = props.size;
        }
        vProps.class = node.props.class || "";
        vProps.class = twMerge(twJoin(vProps.class, ui.value.ring, ui.value.margin), vProps.class);
        return cloneVNode(node, vProps);
      }
      if (max.value !== void 0 && index === max.value) {
        return h(Avatar, {
          size: props.size || appConfig2.ui.avatar.default.size,
          text: `+${children.value.length - max.value}`,
          class: twJoin(ui.value.ring, ui.value.margin)
        });
      }
      return null;
    }).filter(Boolean).reverse());
    return () => h("div", { class: twMerge(ui.value.wrapper, attrs.class), ...omit(attrs, ["class"]) }, clones.value);
  }
});
