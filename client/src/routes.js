import React from 'react'
import Chat from './views/chat'
import NewsItem from './views/news/detail'
import News from './views/news/master'
import TrialTest from './views/trial-tests/detail'
import TrialTests from './views/trial-tests/master'

// examples

const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

const Accordion = React.lazy(() => import('./views/components/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/components/base/breadcrumbs/Breadcrumbs'))
// const Cards = React.lazy(() => import('./views/components/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/components/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/components/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/components/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/components/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/components/base/paginations/Paginations'))
const Popovers = React.lazy(() => import('./views/components/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/components/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/components/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./views/components/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/components/base/tooltips/Tooltips'))

const Buttons = React.lazy(() => import('./views/components/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() =>
  import('./views/components/buttons/button-groups/ButtonGroups'),
)
const Dropdowns = React.lazy(() => import('./views/components/buttons/dropdowns/Dropdowns'))

const ChecksRadios = React.lazy(() => import('./views/components/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() =>
  import('./views/components/forms/floating-labels/FloatingLabels'),
)
const FormControl = React.lazy(() => import('./views/components/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/components/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/components/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/components/forms/range/Range'))
const Select = React.lazy(() => import('./views/components/forms/select/Select'))
const Validation = React.lazy(() => import('./views/components/forms/validation/Validation'))

const CoreUIIcons = React.lazy(() => import('./views/components/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/components/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/components/icons/brands/Brands'))

const Alerts = React.lazy(() => import('./views/components/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/components/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/components/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/components/notifications/toasts/Toasts'))

// const Login = React.lazy(() => import('./views/examples/pages/login/Login'))
// const Register = React.lazy(() => import('./views/examples/pages/register/Register'))
// const Page404 = React.lazy(() => import('./views/examples/pages/page404/Page404'))
// const Page500 = React.lazy(() => import('./views/examples/pages/page500/Page500'))

const Widgets = React.lazy(() => import('./views/components/widgets/Widgets'))

const Charts = React.lazy(() => import('./views/components/charts/Charts'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Logs = React.lazy(() => import('./views/dashboard/logs'))
const Kana = React.lazy(() => import('./views/characters/kana/kana'))
const Joyokanji = React.lazy(() => import('./views/characters/joyokanji/joyokanji'))
const Jinmeiyo = React.lazy(() => import('./views/characters/jinmeiyo/jinmeiyo'))
const SearchCharacter = React.lazy(() => import('./views/characters/search/searchCharacter'))

const Card = React.lazy(() => import('./views/cards/detail/card'))
const Cards = React.lazy(() => import('./views/cards/master/cards'))
const Board = React.lazy(() => import('./views/boards/detail/board'))
const Boards = React.lazy(() => import('./views/boards/master/boards'))
const ListeningBoard = React.lazy(() => import('./views/listening-boards/detail/board'))
const ListeningBoards = React.lazy(() => import('./views/listening-boards/master/boards'))
const DialogBoard = React.lazy(() => import('./views/dialog-boards/detail/board'))
const DialogBoards = React.lazy(() => import('./views/dialog-boards/master/boards'))
const ReadingBoard = React.lazy(() => import('./views/reading-boards/detail/board'))
const ReadingBoards = React.lazy(() => import('./views/reading-boards/master/boards'))
const Topics = React.lazy(() => import('./views/topics/index'))
const TopicDetails = React.lazy(() => import('./views/topics/detail'))
const ChapterDetails = React.lazy(() => import('./views/lessons/index'))
const LessonDetails = React.lazy(() => import('./views/lessons/detail'))
const Furigana = React.lazy(() => import('./views/furigana/index'))
const Dictionary = React.lazy(() => import('./views/dictionary/index'))
const SubTests = React.lazy(() => import('./views/sub-tests/master/index'))
const SubTest = React.lazy(() => import('./views/sub-tests/detail/index'))
const Grammars = React.lazy(() => import('./views/grammar/master/index'))
const Grammar = React.lazy(() => import('./views/grammar/detail/index'))
const NewsCategories = React.lazy(() => import('./views/news-category/master/index'))
const NewsCategory = React.lazy(() => import('./views/news-category/detail/index'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'T???ng quan', component: Dashboard },
  { path: '/logs', name: 'Logs', component: Logs },
  { path: '/theme', name: 'Theme', component: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', name: 'Base', component: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', component: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress', name: 'Progress', component: Progress },
  { path: '/base/spinners', name: 'Spinners', component: Spinners },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', name: 'Buttons', component: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', component: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/forms', name: 'Forms', component: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', component: FormControl },
  { path: '/forms/select', name: 'Select', component: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', component: ChecksRadios },
  { path: '/forms/range', name: 'Range', component: Range },
  { path: '/forms/input-group', name: 'Input Group', component: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', component: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', component: Layout },
  { path: '/forms/validation', name: 'Validation', component: Validation },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/brands', name: 'Brands', component: Brands },
  { path: '/notifications', name: 'Notifications', component: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/notifications/toasts', name: 'Toasts', component: Toasts },
  // { path: '/login', name: 'Login', component: Login },
  // { path: '/register', name: 'Register', component: Register },
  // { path: '/404', name: '404', component: Page404 },
  // { path: '/500', name: '500', component: Page500 },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/characters', name: 'B???ng ch??? c??i', component: Kana, exact: true },
  { path: '/characters/kana', name: 'Kana', component: Kana },
  { path: '/characters/joyokanji', name: 'Joyokanji', component: Joyokanji },
  { path: '/characters/jinmeiyo', name: 'Jinmeiyo', component: Jinmeiyo },
  { path: '/characters/search', name: 'T??m ki???m', component: SearchCharacter },
  { path: '/cards', name: 'Th??? t??? v???ng', component: Cards, exact: true },
  { path: '/cards/addCard', name: 'Th??m m???i', component: Card, specificName: 'addCard' },
  {
    path: '/cards/getCard/:cardId',
    name: 'Th??ng tin th???',
    component: Card,
    specificName: 'getCard',
  },
  { path: '/cards/editCard/:cardId', name: 'S???a', component: Card, specificName: 'editCard' },
  { path: '/boards', name: 'B??i h???c t??? v???ng', component: Boards, exact: true },
  { path: '/boards/addBoard', name: 'Th??m m???i', component: Board, specificName: 'addBoard' },
  {
    path: '/boards/getBoard/:cardId',
    name: 'Th??ng tin b??i h???c',
    component: Board,
    specificName: 'getBoard',
  },
  { path: '/boards/editBoard/:cardId', name: 'S???a', component: Board, specificName: 'editBoard' },
  /** Topics */
  { path: '/topics', name: 'Qu???n l?? ch??? ????? t??? v???ng', component: Topics, exact: true },
  {
    path: '/topics/topicDetail/:topicId',
    name: 'Chi ti???t ch??? ?????',
    component: TopicDetails,
    exact: true,
    specificName: 'topicDetail',
  },
  {
    path: '/topics/:topicId/chapterDetail/:chapterId/lessons',
    name: 'Qu???n l?? b??i h???c',
    component: ChapterDetails,
    exact: true,
    specificName: 'chapterDetail',
  },
  {
    path: '/topics/chapterDetail/:chapterId/lessons/:lessonId/vocab',
    name: 'Qu???n l?? t??? v???ng trong b??i h???c',
    component: LessonDetails,
    exact: true,
    specificName: 'lessons',
  },
  {
    path: '/furigana',
    name: 'Ph??? hiragana l??n ?????u ch??? H??n',
    component: Furigana,
    exact: true,
  },
  { path: '/listening-boards', name: 'B??i h???c nghe', component: ListeningBoards, exact: true },
  {
    path: '/listening-boards/addBoard',
    name: 'Th??m m???i',
    component: ListeningBoard,
    specificName: 'addBoard',
  },
  {
    path: '/listening-boards/getBoard/:cardId',
    name: 'Th??ng tin b??i h???c',
    component: ListeningBoard,
    specificName: 'getBoard',
  },
  {
    path: '/listening-boards/editBoard/:cardId',
    name: 'S???a',
    component: ListeningBoard,
    specificName: 'editBoard',
  },
  { path: '/dialog-boards', name: 'B??i h???c h???i tho???i', component: DialogBoards, exact: true },
  {
    path: '/dialog-boards/addBoard',
    name: 'Th??m m???i',
    component: DialogBoard,
    specificName: 'addBoard',
  },
  {
    path: '/dialog-boards/getBoard/:cardId',
    name: 'Th??ng tin b??i h???c',
    component: DialogBoard,
    specificName: 'getBoard',
  },
  {
    path: '/dialog-boards/editBoard/:cardId',
    name: 'S???a',
    component: DialogBoard,
    specificName: 'editBoard',
  },
  { path: '/reading-boards', name: 'B??i h???c luy???n ?????c', component: ReadingBoards, exact: true },
  {
    path: '/reading-boards/addBoard',
    name: 'Th??m m???i',
    component: ReadingBoard,
    specificName: 'addBoard',
  },
  {
    path: '/reading-boards/getBoard/:cardId',
    name: 'Th??ng tin b??i h???c',
    component: ReadingBoard,
    specificName: 'getBoard',
  },
  {
    path: '/reading-boards/editBoard/:cardId',
    name: 'S???a',
    component: ReadingBoard,
    specificName: 'editBoard',
  },
  {
    path: '/dictionary',
    name: 'T??? ??i???n',
    component: Dictionary,
    specificName: 'dictionary',
  },
  { path: '/sub-tests', name: 'Luy???n thi theo ph???n', component: SubTests, exact: true },
  {
    path: '/sub-tests/getSubTest/:itemId',
    name: 'Th??ng tin b??i thi',
    component: SubTest,
    specificName: 'getSubTest',
  },
  {
    path: '/sub-tests/editSubTest/:itemId',
    name: 'S???a',
    component: SubTest,
    specificName: 'editSubTest',
  },
  {
    path: '/sub-tests/addSubTest',
    name: 'Th??m m???i',
    component: SubTest,
    specificName: 'addSubTest',
  },
  { path: '/trial-tests', name: 'Thi th???', component: TrialTests, exact: true },
  {
    path: '/trial-tests/getTrialTest/:itemId',
    name: 'Th??ng tin b??i thi',
    component: TrialTest,
    specificName: 'getTrialTest',
  },
  {
    path: '/trial-tests/editTrialTest/:itemId',
    name: 'S???a',
    component: TrialTest,
    specificName: 'editTrialTest',
  },
  {
    path: '/trial-tests/addTrialTest',
    name: 'Th??m m???i',
    component: TrialTest,
    specificName: 'addTrialTest',
  },
  { path: '/grammar', name: 'Ng??? ph??p', component: Grammars, exact: true },
  {
    path: '/grammar/getGrammar/:itemId',
    name: 'Th??ng tin b??i h???c',
    component: Grammar,
    specificName: 'getGrammar',
  },
  {
    path: '/grammar/editGrammar/:itemId',
    name: 'S???a',
    component: Grammar,
    specificName: 'editGrammar',
  },
  {
    path: '/grammar/addGrammar',
    name: 'Th??m m???i',
    component: Grammar,
    specificName: 'addGrammar',
  },
  { path: '/news-categories', name: 'Chuy??n m???c b??o m???ng', component: NewsCategories, exact: true },
  {
    path: '/news-categories/getCategory/:itemId',
    name: 'Th??ng tin chuy??n m???c',
    component: NewsCategory,
    specificName: 'getCategory',
  },
  {
    path: '/news-categories/editCategory/:itemId',
    name: 'S???a',
    component: NewsCategory,
    specificName: 'editCategory',
  },
  {
    path: '/news-categories/addCategory',
    name: 'Th??m m???i',
    component: NewsCategory,
    specificName: 'addCategory',
  },
  { path: '/news', name: 'B??i vi???t b??o m???ng', component: News, exact: true },
  {
    path: '/news/getNews/:itemId',
    name: 'Th??ng tin b??i vi???t',
    component: NewsItem,
    specificName: 'getNews',
  },
  {
    path: '/news/editNews/:itemId',
    name: 'S???a',
    component: NewsItem,
    specificName: 'editNews',
  },
  {
    path: '/news/addNews',
    name: 'Th??m m???i',
    component: NewsItem,
    specificName: 'addNews',
  },
  { path: '/chat', name: 'Chat', component: Chat, exact: true },
]

export default routes
