import React, { useState, useEffect } from 'react'
import './style.css'
import { useParams } from 'react-router-dom'
import { newsService } from 'src/services/api/newsService'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import { htmlEntityDecode } from '../../../helpers/htmlentities'
import PageNotFoundComponent from 'src/components/404'
import Loader from 'src/components/Loader'
import { sleep } from 'src/helpers/common'

const NewsWebview = (props) => {
  const { itemId } = useParams()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [pageNotFound, setPageNotFound] = useState(false)
  const [loading, setLoading] = useState(true)
  /* Load item */
  useEffect(() => {
    if (itemId) {
      newsService.getItem(itemId).then((res) => {
        if (res) {
          if (res.status === 401 || res.status === 404 || res.status === 400) {
            setPageNotFound(true)
          } else {
            setTitle(res?.title.includes(':') ? _.trim(res.title.split(':')[1]) : res.title)
            let ct = htmlEntityDecode(res.content)
            ct = ct.replace(/style="font-family: "Times New Roman", serif;"/g, '')
            ct = ct.replace(/style="font-family:"Times New Roman",serif;"/g, '')
            ct = ct.replace(/font-family:"Times New Roman",serif;/g, '')
            ct = ct.replace(/font-family: "Times New Roman", serif;/g, '')
            setContent(ct)
            sleep(1500).then(() => {
              setLoading(false)
            })
          }
        }
      })
    }
  }, [itemId])

  /** ComponentDidMount */

  useEffect(() => {
    const removeAllElementsWithClass = (e) => {
      const paras = document.getElementsByClassName(e)
      while (paras[0]) paras[0].parentNode.removeChild(paras[0])
    }
    /* load css on the fly */
    const css = ['css/news/webview.css']
    css.forEach((item) => {
      const link = document.createElement('link')
      // set the attributes for link element
      link.rel = 'stylesheet'
      link.type = 'text/css'
      link.href = item
      link.classList.add('css-on-the-fly')
      // Get HTML head element to append
      // link element to it
      document.getElementsByTagName('HEAD')[0].appendChild(link)
    })
    return () => {
      removeAllElementsWithClass('css-on-the-fly')
    }
  }, [])
  if (pageNotFound) {
    return <PageNotFoundComponent />
  } else
    return (
      <>
        <Loader loading={loading} />
        {!loading && (
          <div className="page">
            {/* <header tabIndex="0"> {`Luyện đọc ${level} - ${title}`} </header> */}
            {true && (
              <>
                <main>
                  <p
                    style={{
                      fontFamily: "'Source Sans Pro', sans-serif",
                      textAlign: 'center',
                      fontSize: '20px',
                      color: 'green',
                      fontWeight: 'bold',
                    }}
                  >{`${title}`}</p>
                  <div className="content">{renderHTML(content)}</div>
                </main>
              </>
            )}
          </div>
        )}
      </>
    )
}

NewsWebview.propTypes = {}

export default NewsWebview
