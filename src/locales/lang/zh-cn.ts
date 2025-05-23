export default {
  name: 'zh-CN',
  app: {
    title: '图书馆',
  },
  book: {
    title: '书名',
    alias: '别名',
    author: '作者',
    wordcount: '字数',
    category: '分类',
    source: '来源',
    summary: '简介',
    latest: '最后更新',
    rate: '评分',
    stars_x: '{star} 星',
    title_placeholder: '书名，比如：百年孤独',
    alias_placeholder: '其他名称，半路改名的',
    author_placeholder: '作者',
    source_placeholder: '网站名称、链接之类等',
    op_edit: '编辑',
    op_delete: '删除',
    op_finish: '完本',
    op_rate: '评分',
    op_more: '更多',
    btn_edit_book: '编辑图书',
    unkown_author: '佚名',
    msgbox_rate_book: '请给本书评分',
    msgbox_rate_book_title: '评分',
    book_rated_ok: '图书 <{title}> 被评为 {rate} 分',
    book_rated_error: '图书评分失败：{err}',
    finished_book: '已完本',
    confirm_finish_book: '确认此书《{title}》设置为完本吗？',
    book_finished_ok: '已经完本。',
    book_finished_error: '完本设置失败：{err}',
    confirm_delete_book: '确认删除图书 《{title}》吗？注：删除后无法恢复。',
    book_deleted_ok: '已经成功删除图书 《{title}》。',
    book_source: '来源：{source}',
    start_downloading: '开始下载图书...',
    book_downloaded_ok: '已经下载，文件名是：{title}',
    book_downloaded_error: '下载失败：{err}',
    dialog_add_book: '添加图书',
    dialog_edit_book: '编辑图书',
    dialog_search_book: '搜索图书',
    select_category_placeholder: '请选择分类',
    dialog_book_title_is_empty: '需要填写书名',
    saved_ok: '图书《{title}》信息保存成功。',
    saved_error: '图书保存失败：{err}',
    total: '共 {total} 部书',
    all_category: '全部',
  },
  volume: {
    volume_management: '卷管理',
    volume: '卷',
    title: '卷名',
    summary: '简介',
    cover: '封面',
    pagetitle_add_volume: '添加卷',
    pagetitle_edit_volume: '编辑卷',
    dialog_volume_title_is_empty: '需要填写卷名',
    saved_ok: '卷＜{title}＞保存成功。',
    saved_error: '卷保存失败：{err}',
    confirm_delete_volume: '确认删除卷＜{title}＞吗？注：删除后无法恢复。',
    volume_deleted_ok: '已经成功删除卷。',
  },
  chapter: {
    summary: '作品简介',
    next: '下一章',
    previous: '上一章',
    beupto: '连载至',
    default_volume: '正文卷',
    total: '共 {total} 章',
    read_volume_chapters: '阅读本卷所有文章',
    confirm_delete_chapter: '确认删除章节＜{title}＞吗？注：删除后无法恢复。',
    confirm_download_chapter:
      '确认下载图书 《{title}》 吗？下载保存为压缩的文本文件。',
    chapter_deleted_ok: '已经成功删除章节。',
    pagetitle_add_chapter: '添加文章',
    pagetitle_edit_chapter: '编辑文章',
    edit_title_is_empty: '需要填写章节名称',
    edit_content_is_empty: '需要填写章节内容',
    edit_select_volume_placeholder: '选择卷',
    edit_title_label: '章节名',
    edit_content_label: '内容',
    edit_ext_label: '功能',
    edit_ext_search_select_placeholder: '纯文本，或正则表达式模式，比如 /^/',
    edit_ext_search_input_placeholder: '模板',
    edit_ext_replace_select_placeholder: '被替换的文本',
    edit_ext_replace_input_placeholder: '模板',
    btn_replace: '替换',
    btn_format: '格式化',
    btn_restore: '恢复原文',
    saved_ok: '章节＜{title}＞内容保存成功。',
    saved_error: '章节保存失败：{err}',
    add_volume_first: '请添加一个卷。',
  },
  search: {
    search: '搜索',
    dialog_input_placeholder: '输入要搜索的内容，再选择相应的类别',
    dialog_select_title: '书名',
    dialog_select_content: '内容',
    dialog_select_author: '作者',
    dialog_query_is_empty: '请输入要搜索的内容',
    content_input_placeholder: '输入内容关键字，最多返回100条记录',
    result_is_empty: '没有搜索到书籍，请换关键字重试。',
    search_in_book: '在图书《{title}》中搜索',
    query_is_empty: '请输入要搜索的内容',
    header_placeholder: '输入要搜寻的书名',
  },
  login: {
    mobile: '手机',
    password: '密码',
    btn_login: '登录',
    mobile_is_empty: '需要填写手机号，比如：13901390139',
    password_is_empty: '需要填写用户密码',
    login_error: '登录失败: {err}',
  },
  user: {
    pagetitle_edit_pwd: '更改密码',
    edit_pwd_old_pwd: '原来的密码',
    edit_pwd_old_pwd_placeholder: '用来做身份验证',
    edit_pwd_new_pwd: '新的密码',
    edit_pwd_new_pwd_placeholder: '新的密码，注意长度不能小于 {len}',
    edit_pwd_confirm_pwd: '确认新的密码',
    edit_pwd_confirm_pwd_placeholder: '确认新的密码，必须和新的密码一致',
    pwd_is_not_match: '确认新的密码，必须和新的密码一致',
    pwd_is_same: '新密码和原来的密码不能一样',
    old_pwd_is_empty: '需要输入原来的密码来做验证。',
    pwd_is_changed_ok: '密码已经更新，下次登录时，请使用新的密码。',
  },
  author: {
    name: '名称',
    former_name: '曾用名',
    total_books: '作品数量',
    books: '作品',
    name_placeholder: '作者名称',
    former_name_placeholder: '作者曾用名，使用逗号分隔',
    confirm_delete_author: '确认删除作者 《{title}》吗？注：删除后无法恢复。 ',
    author_deleted_ok: '已经成功删除作者 《{title}》。 ',
    saved_ok: '作者《{title}》讯息保存成功。 ',
    saved_error: '作者保存失败：{err}',
    dialog_add_author: '新增作者',
    dialog_edit_author: '编辑作者',
    dialog_author_name_is_empty: '需要填入作者名称',
    search_placeholder: '作者名称或者曾用名',
  },
  config: {
    edit_pwd: '更改密码',
    color_light: '浅色',
    color_dark: '深色',
    locale_zhcn: '简体中文',
    locale_zhtw: '繁體中文',
    locale_en: 'English',
    system_preferences: '参数设置',
    author_mgmt: '作者管理',
    category: '分类',
    confirm_delete_category: '确认删除分类＜{title}＞吗？注：删除后无法恢复。',
    category_deleted_ok: '成功删除分类',
    category_added_ok: '成功添加分类',
    category_edited_ok: '成功更新分类',
    category_edition: '请输入新分类名称',
    category_edition_click_to_edit: '点击分类名称进行编辑',
    category_edition_title_is_empy: '分类名称不能为空',
    btn_new_category: '新分类',
    exit: '退出',
  },
  common: {
    library: '图书馆',
    bookindex: '目录',
    booklist: '书单',
    operation: '管理',
    btn_ok: '确定',
    btn_edit: '编辑',
    btn_volume: '卷',
    btn_new_chapter: '新章节',
    btn_cancel: '取消',
    btn_finish: '完本',
    btn_save: '保存',
    btn_delete: '删除',
    btn_exit: '退出',
    btn_download: '下载',
    btn_search: '搜索',
    confirm_exit: '确认退出登录吗？',
    deleted_ok: '已经成功删除。',
    deleted_error: '删除失败，请稍后重试。失败原因：{err}。',
    validated_error: '验证出错，请重新输入。',
    notfound: '没有找到页面',
    no_permission: '没有查看此页面的权限或者页面不存在。',
    wan: '万',
    resp_50x: '接口没有响应＜{code}＞: {text}。Error: {err}',
    resp_nodata:
      '没有获取到数据，可能接口没有响应＜{code}＞: {text}。Error: {err}',
    unknown_error: '未知错误',
    unknown_menu_item: '错误菜单项',
    welcome: '欢迎',
    shortcut: '快捷键',
  },
}
