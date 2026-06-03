import React from 'react'
import HeroSection from './shared/HeroSection'
import Features from './shared/Featured'
import HowItWorks from './shared/HowItWorks'
import PopularTemplates from './shared/PopularTemplates'
import Pricing from './shared/Pricing'
import Statistics from './shared/Statistics'

const Main = () => {
    return (
        <div>
            <HeroSection />
            <Features />
            <HowItWorks />
            <PopularTemplates />
            <Pricing />
            <Statistics />
        </div>
    )
}

export default Main