import React from 'react'
import { toast } from 'react-toastify'
import { CCard, CCardBody, CRow, CCardFooter } from '@coreui/react'
import PropTypes from 'prop-types'
import '../common.css'
const Keyboard = ({ characters, onClick }) => {
  const array = characters.split('\u200B')
  return (
    <div className="charList">
      {array.map((char, idx) => {
        return (
          char && (
            <span onClick={onClick} style={{ border: 'solid 1px' }}>
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
    toast.success(`Đã chọn ${e.target.textContent}`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }
  const Hiragana =
    'あ​い​う​え​お​か​き​く​け​こ​さ​し​す​せ​そ​た​ち​つ​て​と​な​に​ぬ​ね​の​は​ひ​ふ​へ​ほ​ま​み​む​め​も​や​ゆ​よ​ら​り​る​れ​ろ​わ​ゐ​ゑ​を​ん​ゔ​が​ぎ​ぐ​げ​ご​ざ​じ​ず​ぜ​ぞ​だ​ぢ​づ​で​ど​ば​び​ぶ​べ​ぼ​ぱ​ぴ​ぷ​ぺ​ぽ​ぁ​ぃ​ぅ​ぇ​ぉ​ゕ​ゖ​っ​ゃ​ゅ​ょ​ゎ​'
  const Katakana =
    'ア​イ​ウ​エ​オ​カ​キ​ク​ケ​コ​サ​シ​ス​セ​ソ​タ​チ​ツ​テ​ト​ナ​ニ​ヌ​ネ​ノ​ハ​ヒ​フ​ヘ​ホ​マ​ミ​ム​メ​モ​ヤ​ユ​ヨ​ラ​リ​ル​レ​ロ​ワ​ヰ​ヱ​ヲ​ン​ヴ​ガ​ギ​グ​ゲ​ゴ​ザ​ジ​ズ​ゼ​ゾ​ダ​ヂ​ヅ​デ​ド​バ​ビ​ブ​ベ​ボ​パ​ピ​プ​ペ​ポ​ヷ​ヸ​ヹ​ヺ​ァ​ィ​ゥ​ェ​ォ​ヵ​ヶ​ッ​ャ​ュ​ョ​ヮ​ー​'
  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow></CRow>
        </CCardBody>
        <CCardFooter>
          <CRow className="text-center">
            <Keyboard characters={Hiragana} onClick={handleClick} />
          </CRow>
          <CRow className="text-center">
            <Keyboard characters={Katakana} onClick={handleClick} />
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
