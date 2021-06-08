import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  CCard,
  CCardBody,
  CRow,
  CCardFooter,
  CImage,
  CCol,
  CCardText,
  CBadge,
  CCardTitle,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { getHtmlEntityCodeFromDecodedString } from '../../../helpers/htmlentities'
import { svgService } from '../../../services/api/svgService'
import '../common.css'
const Keyboard = ({ characters, onClick }) => {
  const array = characters.split('\u200B')
  return (
    <div className="charList">
      {array.map((char, idx) => {
        return (
          char && (
            <span onClick={onClick} style={{ border: 'solid 1px' }} key={char}>
              {char}
            </span>
          )
        )
      })}
    </div>
  )
}
const Joyokanji = () => {
  const handleClick = (e) => {
    // toast.success(`Đã chọn ${e.target.textContent}`, {
    //   position: 'top-right',
    //   autoClose: 3000,
    //   hideProgressBar: true,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    // })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSelectedCharacter(e.target.textContent)
  }
  const G1 =
    '一​七​三​上​下​中​九​二​五​人​休​先​入​八​六​円​出​力​十​千​口​右​名​四​土​夕​大​天​女​子​字​学​小​山​川​左​年​手​文​日​早​月​木​本​村​林​校​森​正​気​水​火​犬​玉​王​生​田​男​町​白​百​目​石​空​立​竹​糸​耳​花​草​虫​見​貝​赤​足​車​金​雨​青​音'
  const G2 =
    '万​丸​交​京​今​会​体​何​作​元​兄​光​公​内​冬​刀​分​切​前​北​午​半​南​原​友​古​台​合​同​回​図​国​園​地​場​声​売​夏​外​多​夜​太​妹​姉​室​家​寺​少​岩​工​市​帰​広​店​弓​引​弟​弱​強​当​形​後​心​思​戸​才​教​数​新​方​明​星​春​昼​時​晴​曜​書​朝​来​東​楽​歌​止​歩​母​毎​毛​池​汽​活​海​点​父​牛​理​用​画​番​直​矢​知​社​秋​科​答​算​米​紙​細​組​絵​線​羽​考​聞​肉​自​船​色​茶​行​西​親​角​言​計​記​話​語​読​谷​買​走​近​通​週​道​遠​里​野​長​門​間​雪​雲​電​頭​顔​風​食​首​馬​高​魚​鳥​鳴​麦​黄​黒​'
  const G3 =
    '丁​世​両​主​乗​予​事​仕​他​代​住​使​係​倍​全​具​写​列​助​勉​動​勝​化​区​医​去​反​取​受​号​向​君​味​命​和​品​員​商​問​坂​夫​始​委​守​安​定​実​客​宮​宿​寒​対​局​屋​岸​島​州​帳​平​幸​度​庫​庭​式​役​待​急​息​悪​悲​想​意​感​所​打​投​拾​持​指​放​整​旅​族​昔​昭​暑​暗​曲​有​服​期​板​柱​根​植​業​様​横​橋​次​歯​死​氷​決​油​波​注​泳​洋​流​消​深​温​港​湖​湯​漢​炭​物​球​由​申​界​畑​病​発​登​皮​皿​相​県​真​着​短​研​礼​神​祭​福​秒​究​章​童​笛​第​筆​等​箱​級​終​緑​練​羊​美​習​者​育​苦​荷​落​葉​薬​血​表​詩​調​談​豆​負​起​路​身​転​軽​農​返​追​送​速​進​遊​運​部​都​配​酒​重​鉄​銀​開​院​陽​階​集​面​題​飲​館​駅​鼻​'
  const G4 =
    '不​争​付​令​以​仲​伝​位​低​例​便​信​倉​候​借​停​健​側​働​億​兆​児​共​兵​典​冷​初​別​利​刷​副​功​加​努​労​勇​包​卒​協​単​博​印​参​史​司​各​告​周​唱​喜​器​囲​固​型​堂​塩​士​変​央​失​好​季​孫​完​官​害​察​巣​差​希​席​帯​底​府​康​建​径​徒​得​必​念​愛​成​戦​折​挙​改​救​敗​散​料​旗​昨​景​最​望​未​末​札​材​束​松​果​栄​案​梅​械​極​標​機​欠​歴​残​殺​毒​氏​民​求​治​法​泣​浅​浴​清​満​漁​灯​無​然​焼​照​熱​牧​特​産​的​省​祝​票​種​積​競​笑​管​節​粉​紀​約​結​給​続​置​老​胃​脈​腸​臣​航​良​芸​芽​英​菜​街​衣​要​覚​観​訓​試​説​課​議​象​貨​貯​費​賞​軍​輪​辞​辺​連​達​選​郡​量​録​鏡​関​陸​隊​静​順​願​類​飛​飯​養​験​'
  const G5 =
    '久​仏​仮​件​任​似​余​価​保​修​俵​個​備​像​再​刊​判​制​券​則​効​務​勢​厚​句​可​営​因​団​圧​在​均​基​報​境​墓​増​夢​妻​婦​容​寄​富​導​居​属​布​師​常​幹​序​弁​張​往​復​徳​志​応​快​性​恩​情​態​慣​承​技​招​授​採​接​提​損​支​政​故​敵​断​旧​易​暴​条​枝​査​格​桜​検​構​武​比​永​河​液​混​減​測​準​演​潔​災​燃​版​犯​状​独​率​現​留​略​益​眼​破​確​示​祖​禁​移​程​税​築​精​素​経​統​絶​綿​総​編​績​織​罪​群​義​耕​職​肥​能​興​舌​舎​術​衛​製​複​規​解​設​許​証​評​講​謝​識​護​豊​財​貧​責​貸​貿​賀​資​賛​質​輸​述​迷​退​逆​造​過​適​酸​鉱​銅​銭​防​限​険​際​雑​非​預​領​額​飼'
  const G6 =
    '並​乱​乳​亡​仁​供​俳​値​傷​優​党​冊​処​刻​割​創​劇​勤​危​卵​厳​収​后​否​吸​呼​善​困​垂​城​域​奏​奮​姿​存​孝​宅​宇​宗​宙​宝​宣​密​寸​専​射​将​尊​就​尺​届​展​層​己​巻​幕​干​幼​庁​座​延​律​従​忘​忠​憲​我​批​担​拝​拡​捨​探​推​揮​操​敬​映​晩​暖​暮​朗​机​枚​染​株​棒​模​権​樹​欲​段​沿​泉​洗​派​済​源​潮​激​灰​熟​片​班​異​疑​痛​皇​盛​盟​看​砂​磁​私​秘​穀​穴​窓​筋​策​簡​糖​系​紅​納​純​絹​縦​縮​署​翌​聖​肺​背​胸​脳​腹​臓​臨​至​若​著​蒸​蔵​蚕​衆​裁​装​裏​補​視​覧​討​訪​訳​詞​誌​認​誕​誠​誤​論​諸​警​貴​賃​遺​郵​郷​針​鋼​閉​閣​降​陛​除​障​難​革​頂​骨​'
  const G7 =
    '乙​了​又​丈​与​及​乞​凡​刃​巾​互​丹​乏​井​冗​凶​刈​勾​匂​匹​升​厄​双​介​孔​屯​幻​弔​斗​斤​爪​牙​且​丘​丙​丼​巨​仙​凹​凸​占​叱​召​囚​奴​尻​尼​巧​払​氾​汁​込​斥​旦​玄​瓦​甘​甲​矛​伎​仰​伐​伏​充​刑​劣​匠​企​吉​叫​吐​吏​壮​如​妃​妄​尽​巡​帆​弐​忙​扱​汎​汚​汗​江​芋​芝​迅​旨​旬​肌​朽​朱​朴​缶​臼​舟​串​亜​佐​伺​伸​但​伯​伴​克​冶​励​却​即​呂​含​吟​呉​吹​呈​坑​坊​壱​妖​妥​妊​妨​妙​寿​尿​尾​岐​床​廷​弄​抗​抄​択​把​抜​扶​抑​沙​汰​沃​沖​沢​沈​没​狂​芯​芳​迎​那​邦​阪​忌​忍​戒​戻​攻​更​肘​肝​肖​杉​秀​辛​享​依​佳​侍​侮​併​免​刹​刺​到​劾​卓​叔​呪​坪​奈​奇​奉​奔​妬​姓​宛​宜​尚​屈​岡​岳​岬​弥​弦​征​彼​怪​怖​拉​押​拐​拒​拠​拘​拙​拓​抽​抵​拍​披​抱​抹​況​沼​泥​泊​泌​沸​泡​狙​苛​茎​苗​茂​迭​迫​邪​邸​阻​附​房​旺​昆​昇​股​肩​肯​肢​肪​枕​枢​析​杯​枠​欧​殴​炎​炊​炉​采​玩​祈​祉​盲​突​虎​阜​斉​亭​侶​侯​俊​侵​促​俗​冠​削​勃​勅​卑​卸​厘​叙​咽​哀​咲​垣​契​威​姻​孤​封​峡​峠​帥​帝​幽​弧​悔​恒​恨​拶​拭​括​挟​拷​挑​洪​浄​津​洞​狭​狩​茨​荒​荘​逃​郊​郎​怨​怠​怒​施​昧​是​胎​胆​胞​柿​柵​栃​架​枯​柔​柄​某​柳​為​牲​珍​甚​畏​疫​皆​盆​眉​盾​冒​砕​窃​糾​耐​臭​虐​虹​衷​訃​訂​貞​赴​軌​香​俺​倹​倒​倣​俸​倫​兼​冥​凄​准​凍​剥​剣​剛​剤​剖​匿​唄​哺​唆​唇​哲​唐​埋​娯​娠​姫​娘​宴​宰​宵​峰​徐​悦​悟​悩​挨​捉​挫​振​捜​挿​捕​浦​浸​浜​浮​涙​浪​華​逝​逐​逓​途​透​陥​陣​恣​恐​恵​恥​恋​恭​扇​拳​敏​脇​脊​脅​脂​朕​胴​桁​核​桑​栽​桟​栓​桃​殊​殉​烈​珠​祥​泰​畝​畜​畔​疾​症​疲​眠​砲​称​租​秩​袖​被​既​粋​索​紛​紡​紋​翁​耗​致​般​蚊​衰​託​貢​軒​辱​酎​酌​釜​隻​飢​鬼​竜​曹​乾​偽​偶​偵​偏​剰​勘​唾​喝​啓​唯​埼​堆​執​培​婚​婆​寂​尉​崖​崎​崇​崩​庶​庸​彩​彫​惧​惨​惜​悼​捻​捗​掛​掘​掲​控​据​措​掃​排​描​堀​淫​涯​渇​渓​渋​淑​渉​淡​添​涼​猫​猛​猟​葛​萎​菓​菊​菌​逸​逮​郭​陰​陳​陶​陪​隆​陵​患​悠​戚​斜​斬​旋​曽​脚​脱​梗​梨​殻​爽​瓶​痕​盗​眺​窒​符​粗​粘​粒​紺​紹​紳​累​羞​粛​舷​舶​虚​蛍​蛇​袋​訟​豚​貪​貫​販​赦​軟​酔​釈​釣​頃​鹿​麻​斎​亀​僅​偉​傍​募​傘​喉​喩​喚​喫​喪​圏​堪​堅​堕​塚​堤​塔​塀​塁​奥​媛​媒​婿​尋​嵐​項​幅​帽​幾​廃​廊​弾​御​循​慌​惰​愉​握​援​換​搭​揚​揺​湧​渦​滋​湿​渡​湾​猶​葬​遇​遂​遅​遍​隅​随​惑​扉​掌​敢​斑​暁​晶​替​普​腕​椅​椎​棺​棋​棚​棟​款​欺​殖​煮​焦​琴​畳​疎​痩​痘​痢​硬​硝​硫​裕​筒​粧​絞​紫​絡​蛮​裂​詠​詐​詔​診​訴​貼​越​超​距​軸​酢​鈍​閑​雇​雄​雰​須​傲​傾​傑​債​催​僧​勧​嗅​嗣​嘆​塞​填​毀​塊​塑​塗​奨​嫉​嫁​嫌​寛​寝​廉​彙​微​慄​慨​慎​携​搾​摂​搬​溺​滑​溝​滞​滝​漠​滅​溶​猿​蓋​蓄​遡​遜​違​遣​隙​隔​愚​慈​愁​暇​腎​腫​腺​腰​楷​棄​楼​歳​殿​煙​煩​煎​献​禍​禅​痴​睦​睡​督​碁​稚​窟​裾​褐​裸​継​羨​艇​虞​虜​蜂​触​詣​詮​該​詰​誇​詳​誉​賂​賊​賄​跡​践​跳​較​載​酬​酪​鉛​鉢​鈴​雅​雷​零​飾​飽​靴​頓​頑​頒​鼓​僕​僚​塾​墨​奪​嫡​寡​寧​彰​徴​憎​慢​摘​漆​漸​漬​滴​漂​漫​漏​蔑​遮​遭​隠​慕​暦​膜​概​熊​獄​瑠​瘍​罰​碑​稲​端​箸​箋​箇​綻​維​綱​緒​網​腐​蜜​誓​誘​豪​貌​踊​辣​酵​酷​銃​銘​閥​雌​需​餅​駆​駄​髪​魂​儀​勲​舗​嘲​嘱​噴​墜​墳​審​寮​履​幣​慶​弊​影​徹​憧​憬​憤​撮​撤​撲​潰​潟​潤​澄​潜​蔽​遵​遷​慰​憂​慮​戯​摯​撃​摩​敷​暫​膝​膚​槽​歓​璃​畿​監​盤​罵​罷​稽​稼​稿​穂​窮​窯​範​縁​緩​緊​締​縄​衝​褒​誰​謁​請​諾​賭​賜​賠​賓​賦​趣​踪​踏​輝​輩​舞​鋭​鋳​閲​震​霊​餓​餌​頬​駒​駐​魅​黙​儒​凝​壊​墾​壌​壇​壁​嬢​憶​懐​憾​擁​濁​濃​獲​薫​薪​薦​薄​還​避​隣​憩​曇​膳​膨​獣​磨​穏​篤​緻​緯​縛​繁​縫​融​衡​諦​謎​諧​諮​謀​諭​謡​賢​醒​麺​錦​錮​錯​錠​錬​隷​頼​骸​償​嚇​擬​擦​濯​懇​戴​曖​臆​燥​爵​犠​環​療​瞳​瞭​矯​礁​繊​翼​聴​謹​謙​謄​購​轄​醜​鍵​鍋​鍛​闇​霜​韓​頻​鮮​齢​濫​藤​藍​藩​懲​璧​癖​癒​瞬​礎​穫​襟​糧​繕​繭​翻​覆​贈​鎌​鎖​鎮​闘​顎​顕​騎​騒​瀬​藻​爆​璽​羅​簿​繰​艶​覇​譜​蹴​離​霧​韻​髄​鯨​鶏​麓​麗​懸​欄​籍​譲​醸​鐘​響​騰​艦​躍​露​顧​魔​鶴​籠​襲​驚​鑑​鬱​'
  const [selectedCharacter, setSelectedCharacter] = useState('')
  const [htmlEntityCode, setHtmlEntityCode] = useState('')
  const [svgCode, setSvgCode] = useState('')
  const [characterContent, setCharacterContent] = useState('')
  const [srcSvg, setSrcSvg] = useState('avatars/default.png')
  useEffect(() => {
    // fetch svg src
    if (selectedCharacter) {
      const svgCode = getHtmlEntityCodeFromDecodedString(selectedCharacter)
      svgService.getSvg(svgCode, selectedCharacter).then((res) => {
        if (res) {
          setSrcSvg(res.src)
          setHtmlEntityCode(res.htmlEntityCode)
          setCharacterContent(res.characterContent)
          setSvgCode(res.svgCode)
        } else {
          toast.error(`Mẫu chữ chưa được tạo cho ${selectedCharacter}`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        }
      })
    }
  }, [selectedCharacter])
  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CCardTitle className="text-center">HƯỚNG DẪN VIẾT</CCardTitle>
          <CRow className="align-items-center">
            <CCol sm="4"></CCol>
            <CCol sm="4">
              <CCard>
                <CImage src={srcSvg} size="xs"></CImage>
                <CCardBody className="text-center">
                  {characterContent && (
                    <CCardText>
                      Kí tự: <CBadge color="success">{characterContent}</CBadge>
                    </CCardText>
                  )}
                  {svgCode && (
                    <CCardText>
                      Code: <CBadge color="success">{svgCode}</CBadge>
                    </CCardText>
                  )}
                  {htmlEntityCode && (
                    <CCardText>
                      HTML Entity Code: <CBadge color="success">{htmlEntityCode}</CBadge>
                    </CCardText>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="4"></CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CRow className="text-center">
            <Keyboard characters={G1} onClick={handleClick} />
          </CRow>
          <CRow className="text-center">
            <Keyboard characters={G2} onClick={handleClick} />
          </CRow>
          <CRow className="text-center">
            <Keyboard characters={G3} onClick={handleClick} />
          </CRow>
          <CRow className="text-center">
            <Keyboard characters={G4} onClick={handleClick} />
          </CRow>
          <CRow className="text-center">
            <Keyboard characters={G5} onClick={handleClick} />
          </CRow>
          <CRow className="text-center">
            <Keyboard characters={G6} onClick={handleClick} />
          </CRow>
          <CRow className="text-center">
            <Keyboard characters={G7} onClick={handleClick} />
          </CRow>
        </CCardFooter>
      </CCard>
    </>
  )
}

export default Joyokanji

Keyboard.propTypes = {
  characters: PropTypes.string,
  onClick: PropTypes.func,
}
