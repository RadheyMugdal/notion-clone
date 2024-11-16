import Header from '@/components/landing-page/header'
import TitleSection from '@/components/landing-page/title-section'
import React from 'react'

const HomepageLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <main>
        <Header/>
        {children}
    </main>
  )
}

export default HomepageLayout
