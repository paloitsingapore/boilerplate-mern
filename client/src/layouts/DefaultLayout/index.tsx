import {ReactNodeLike} from 'prop-types'
import React from 'react'
import Header from '../../components/Header'
import './DefaultLayout.scss'

interface IDefaultLayoutProps {
  children: ReactNodeLike,
}

const DefaultLayout = ({children}: IDefaultLayoutProps) =>{
  return(
      <>
        <Header/>
        <main className="default-layout" data-testid="default-layout">{children}</main>
      </>
  )
}

export default DefaultLayout;
