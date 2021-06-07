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
const Jinmeiyo = () => {
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
  const jimeiyo =
    '丑​丞​乃​之​乎​也​云​亘​些​亦​亥​亨​亮​仔​伊​伍​伽​佃​佑​伶​侃​侑​俄​俠​俣​俐​倭​俱​倦​倖​偲​傭​儲​允​兎​兜​其​冴​凌​凜​凧​凪​凰​凱​函​劉​劫​勁​勺​勿​匁​匡​廿​卜​卯​卿​厨​厩​叉​叡​叢​叶​只​吾​吞​吻​哉​哨​啄​哩​喬​喧​喰​喋​嘩​嘉​嘗​噌​噂​圃​圭​坐​尭​坦​埴​堰​堺​堵​塙​壕​壬​夷​奄​奎​套​娃​姪​姥​娩​嬉​孟​宏​宋​宕​宥​寅​寓​寵​尖​尤​屑​峨​峻​崚​嵯​嵩​嶺​巌​巫​已​巳​巴​巷​巽​帖​幌​幡​庄​庇​庚​庵​廟​廻​弘​弛​彗​彦​彪​彬​徠​忽​怜​恢​恰​恕​悌​惟​惚​悉​惇​惹​惺​惣​慧​憐​戊​或​戟​托​按​挺​挽​掬​捲​捷​捺​捧​掠​揃​摑​摺​撒​撰​撞​播​撫​擢​孜​敦​斐​斡​斧​斯​於​旭​昂​昊​昏​昌​昴​晏​晃​晒​晋​晟​晦​晨​智​暉​暢​曙​曝​曳​朋​朔​杏​杖​杜​李​杭​杵​杷​枇​柑​柴​柘​柊​柏​柾​柚​桧​栞​桔​桂​栖​桐​栗​梧​梓​梢​梛​梯​桶​梶​椛​梁​棲​椋​椀​楯​楚​楕​椿​楠​楓​椰​楢​楊​榎​樺​榊​榛​槙​槍​槌​樫​槻​樟​樋​橘​樽​橙​檎​檀​櫂​櫛​櫓​欣​欽​歎​此​殆​毅​毘​毬​汀​汝​汐​汲​沌​沓​沫​洸​洲​洵​洛​浩​浬​淵​淳​渚​淀​淋​渥​湘​湊​湛​溢​滉​溜​漱​漕​漣​澪​濡​瀕​灘​灸​灼​烏​焰​焚​煌​煤​煉​熙​燕​燎​燦​燭​燿​爾​牒​牟​牡​牽​犀​狼​猪​獅​玖​珂​珈​珊​珀​玲​琢​琉​瑛​琥​琶​琵​琳​瑚​瑞​瑶​瑳​瓜​瓢​甥​甫​畠​畢​疋​疏​皐​皓​眸​瞥​矩​砦​砥​砧​硯​碓​碗​碩​碧​磐​磯​祇​祢​祐​祷​禄​禎​禽​禾​秦​秤​稀​稔​稟​稜​穣​穹​穿​窄​窪​窺​竣​竪​竺​竿​笈​笹​笙​笠​筈​筑​箕​箔​篇​篠​簞​簾​籾​粥​粟​糊​紘​紗​紐​絃​紬​絆​絢​綺​綜​綴​緋​綾​綸​縞​徽​繫​繡​纂​纏​羚​翔​翠​耀​而​耶​耽​聡​肇​肋​肴​胤​胡​脩​腔​脹​膏​臥​舜​舵​芥​芹​芭​芙​芦​苑​茄​苔​苺​茅​茉​茸​茜​莞​荻​莫​莉​菅​菫​菖​萄​菩​萌​萊​菱​葦​葵​萱​葺​萩​董​葡​蓑​蒔​蒐​蒼​蒲​蒙​蓉​蓮​蔭​蔣​蔦​蓬​蔓​蕎​蕨​蕉​蕃​蕪​薙​蕾​蕗​藁​薩​蘇​蘭​蝦​蝶​螺​蟬​蟹​蠟​衿​袈​袴​裡​裟​裳​襖​訊​訣​註​詢​詫​誼​諏​諄​諒​謂​諺​讃​豹​貰​賑​赳​跨​蹄​蹟​輔​輯​輿​轟​辰​辻​迂​迄​辿​迪​迦​這​逞​逗​逢​遥​遁​遼​邑​祁​郁​鄭​酉​醇​醐​醍​醬​釉​釘​釧​銑​鋒​鋸​錘​錐​錆​錫​鍬​鎧​閃​閏​閤​阿​陀​隈​隼​雀​雁​雛​雫​霞​靖​鞄​鞍​鞘​鞠​鞭​頁​頌​頗​顚​颯​饗​馨​馴​馳​駕​駿​驍​魁​魯​鮎​鯉​鯛​鰯​鱒​鱗​鳩​鳶​鳳​鴨​鴻​鵜​鵬​鷗​鷲​鷺​鷹​麒​麟​麿​黎​黛​鼎​亞​惡​爲​逸​榮​衞​謁​圓​緣​薗​應​櫻​奧​橫​溫​價​禍​悔​海​壞​懷​樂​渴​卷​陷​寬​漢​氣​祈​器​僞​戲​虛​峽​狹​響​曉​勤​謹​駈​勳​薰​惠​揭​鷄​藝​擊​縣​儉​劍​險​圈​檢​顯​驗​嚴​廣​恆​黃​國​黑​穀​碎​雜​祉​視​兒​濕​實​社​者​煮​壽​收​臭​從​澁​獸​縱​祝​暑​署​緖​諸​敍​將​祥​涉​燒​奬​條​狀​乘​淨​剩​疊​孃​讓​釀​神​眞​寢​愼​盡​粹​醉​穗​瀨​齊​靜​攝​節​專​戰​纖​禪​祖​壯​爭​莊​搜​巢​曾​裝​僧​層​瘦​騷​增​憎​藏​贈​臟​卽​帶​滯​瀧​單​嘆​團​彈​晝​鑄​著​廳​徵​聽​懲​鎭​轉​傳​都​嶋​燈​盜​稻​德​突​難​拜​盃​賣​梅​髮​拔​繁​晚​卑​祕​碑​賓​敏​冨​侮​福​拂​佛​勉​步​峯​墨​飜​每​萬​默​埜​彌​藥​與​搖​樣​謠​來​賴​覽​欄​龍​虜​凉​綠​淚​壘​類​禮​曆​歷​練​鍊​郞​朗​廊​錄​亙​凛​堯​巖​晄​檜​槇​渚​猪​琢​禰​祐​禱​祿​禎​穰​萠​遙​'
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
          <CCardTitle className="text-center">HƯỚNG DẪN</CCardTitle>
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
            <Keyboard characters={jimeiyo} onClick={handleClick} />
          </CRow>
        </CCardFooter>
      </CCard>
    </>
  )
}

export default Jinmeiyo

Keyboard.propTypes = {
  characters: PropTypes.string,
  onClick: PropTypes.func,
}
