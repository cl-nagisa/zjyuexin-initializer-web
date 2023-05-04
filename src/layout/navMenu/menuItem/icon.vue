<script>
export default {
  name: 'MenuIcon',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    }
  },
  render (h, context) {
    const { icon } = context.props
    const vnodes = []
    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }
    return vnodes
  }
}
</script>
