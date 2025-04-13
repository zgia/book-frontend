export default {
  name: 'zh-TW',
  app: {
    title: '圖書館',
  },
  book: {
    title: '書名',
    alias: '別名',
    author: '作者',
    wordcount: '字數',
    category: '分類',
    source: '來源',
    summary: '簡介',
    latest: '最後更新',
    rate: '評分',
    stars_x: '{star} 星',
    title_placeholder: '書名，例如：百年孤寂',
    alias_placeholder: '其他名稱，半路改名的',
    author_placeholder: '作者',
    source_placeholder: '網站名稱、連結之類等',
    op_edit: '編輯',
    op_delete: '刪除',
    op_finish: '完本',
    op_rate: '評分',
    op_more: '更多',
    btn_edit_book: '編輯圖書',
    unkown_author: '佚名',
    msgbox_rate_book: '請給本書評分',
    msgbox_rate_book_title: '評分',
    book_rated_ok: '圖書 <{title}> 被評為 {rate} 分',
    book_rated_error: '圖書評分失敗：{err}',
    finished_book: '已完本',
    confirm_finish_book: '確認此書《{title}》設定為完本嗎？ ',
    book_finished_ok: '已經完本。 ',
    book_finished_error: '完本設定失敗：{err}',
    confirm_delete_book: '確認刪除圖書 《{title}》嗎？註：刪除後無法恢復。 ',
    book_deleted_ok: '已經成功刪除圖書 《{title}》。 ',
    book_source: '來源：{source}',
    start_downloading: '開始下載圖書...',
    book_downloaded_ok: '已經下載，檔名是：{title}',
    book_downloaded_error: '下載失敗：{err}',
    dialog_add_book: '新增圖書',
    dialog_edit_book: '編輯圖書',
    dialog_search_book: '搜索圖書',
    select_category_placeholder: '請選擇分類',
    dialog_book_title_is_empty: '需要填入書名',
    saved_ok: '圖書《{title}》訊息保存成功。 ',
    saved_error: '圖書保存失敗：{err}',
    total: '共 {total} 部書',
    all_category: '全部',
  },
  volume: {
    volume_management: '卷管理',
    volume: '卷',
    title: '卷名',
    summary: '簡介',
    cover: '封面',
    pagetitle_add_volume: '新增卷',
    pagetitle_edit_volume: '編輯卷',
    dialog_volume_title_is_empty: '需要填入卷名稱',
    saved_ok: '卷＜{title}＞保存成功。 ',
    saved_error: '卷儲存失敗：{err}',
    confirm_delete_volume: '確認刪除卷＜{title}＞嗎？註：刪除後無法恢復。 ',
    volume_deleted_ok: '已經成功刪除卷。 ',
  },
  chapter: {
    summary: '作品簡介',
    next: '下一章',
    previous: '上一章',
    beupto: '連載至',
    default_volume: '正文卷',
    total: '共 {total} 章',
    read_volume_chapters: '閱讀本卷所有文章',
    confirm_delete_chapter: '確認刪除章節＜{title}＞嗎？註：刪除後無法恢復。 ',
    confirm_download_chapter:
      '確認下載圖書 《{title}》 嗎？下載儲存為壓縮的文字檔案。 ',
    chapter_deleted_ok: '已經成功刪除章節。 ',
    pagetitle_add_chapter: '新增文章',
    pagetitle_edit_chapter: '編輯文章',
    edit_title_is_empty: '需要填入章節名稱',
    edit_content_is_empty: '需要填入章節內容',
    edit_select_volume_placeholder: '選擇卷',
    edit_title_label: '章節名',
    edit_content_label: '內容',
    edit_ext_label: '功能',
    edit_ext_search_select_placeholder: '純文本，或正規表示式模式，如 /^/',
    edit_ext_search_input_placeholder: '範本',
    edit_ext_replace_select_placeholder: '被取代的文字',
    edit_ext_replace_input_placeholder: '範本',
    btn_replace: '替換',
    btn_format: '格式化',
    btn_restore: '恢復原文',
    saved_ok: '章節＜{title}＞內容保存成功。 ',
    saved_error: '章節儲存失敗：{err}',
    add_volume_first: '請新增一個卷。 ',
  },
  search: {
    search: '搜尋',
    dialog_input_placeholder: '輸入要搜尋的內容，再選擇對應的類別',
    dialog_select_title: '書名',
    dialog_select_content: '內容',
    dialog_select_author: '作者',
    dialog_query_is_empty: '請輸入要搜尋的內容',
    content_input_placeholder: '輸入內容關鍵字，最多回傳100筆記錄',
    result_is_empty: '沒有搜尋到書籍，請換關鍵字重試。 ',
    search_in_book: '在圖書《{title}》中搜尋',
    query_is_empty: '請輸入要搜尋的內容',
    header_placeholder: '輸入要搜尋的書名',
  },
  login: {
    mobile: '手機',
    password: '密碼',
    btn_login: '登入',
    mobile_is_empty: '需要填寫手機號碼，例如：13901390139',
    password_is_empty: '需要填入使用者密碼',
    login_error: '登入失敗: {err}',
  },
  user: {
    pagetitle_edit_pwd: '更改密碼',
    edit_pwd_old_pwd: '原來的密碼',
    edit_pwd_old_pwd_placeholder: '用來做身份驗證',
    edit_pwd_new_pwd: '新的密碼',
    edit_pwd_new_pwd_placeholder: '新的密碼，注意長度不能小於 {len}',
    edit_pwd_confirm_pwd: '確認新的密碼',
    edit_pwd_confirm_pwd_placeholder: '確認新的密碼，必須和新的密碼一致',
    pwd_is_not_match: '確認新的密碼，必須和新的密碼一致',
    pwd_is_same: '新密碼和原來的密碼不能一樣',
    old_pwd_is_empty: '需要輸入原來的密碼來做驗證。 ',
    pwd_is_changed_ok: '密碼已經更新，下次登入時，請使用新的密碼。 ',
  },
  author: {
    name: '名稱',
    former_name: '曾用名',
    total_books: '作品數量',
    books: '作品',
    name_placeholder: '作者名稱',
    former_name_placeholder: '作者曾用名，使用逗號分隔',
    confirm_delete_author: '確認刪除作者 《{title}》嗎？註：刪除後無法恢復。 ',
    author_deleted_ok: '已經成功刪除作者 《{title}》。 ',
    saved_ok: '作者《{title}》訊息保存成功。 ',
    saved_error: '作者保存失敗：{err}',
    dialog_add_author: '新增作者',
    dialog_edit_author: '編輯作者',
    dialog_author_name_is_empty: '需要填入作者名稱',
    search_placeholder: '作者名稱或者曾用名',
  },
  config: {
    edit_pwd: '更改密碼',
    color_light: '淺色',
    color_dark: '深色',
    locale_zhcn: '简体中文',
    locale_zhtw: '繁體中文',
    locale_en: 'English',
    system_preferences: '參數設定',
    author_mgmt: '作者管理',
    category: '分類',
    confirm_delete_category: '確認刪除分類＜{title}＞嗎？註：刪除後無法恢復。 ',
    category_deleted_ok: '成功刪除分類',
    category_added_ok: '成功加入分類',
    category_edited_ok: '成功更新分類',
    category_edition: '請輸入新分類名稱',
    category_edition_click_to_edit: '點選分類名稱來編輯',
    category_edition_title_is_empy: '分類名稱不能為空白',
    btn_new_category: '新分類',
    exit: '退出',
  },
  common: {
    library: '圖書館',
    bookindex: '目錄',
    booklist: '書單',
    operation: '管理',
    btn_ok: '確定',
    btn_edit: '編輯',
    btn_volume: '卷',
    btn_new_chapter: '新章節',
    btn_cancel: '取消',
    btn_finish: '完本',
    btn_save: '保存',
    btn_delete: '刪除',
    btn_exit: '退出',
    btn_download: '下載',
    btn_search: '搜尋',
    confirm_exit: '確認退出登入嗎？ ',
    deleted_ok: '已經成功刪除。 ',
    deleted_error: '刪除失敗，請稍後重試。失敗原因：{err}。 ',
    validated_error: '驗證出錯，請重新輸入。 ',
    notfound: '沒有找到頁面',
    no_permission: '冇有查看此頁麵的權限或者頁麵不存在。',
    wan: '萬',
    resp_50x: '介面沒有回應＜{code}＞: {text}。 Error: {err}',
    resp_nodata:
      '沒有取得到數據，可能介面沒有回應＜{code}＞: {text}。 Error: {err}',
    unknown_error: '未知錯誤',
    unknown_menu_item: '錯誤菜單項',
    welcome: '歡迎',
    shortcut: '快捷鍵',
  },
}
