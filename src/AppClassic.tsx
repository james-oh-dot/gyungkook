import { BrowserRouter } from 'react-router-dom'
import { HeroClassic } from './components/HeroClassic'
import { VersionSwitch } from './components/VersionSwitch'
import {
  AboutSection,
  AchievementsSection,
  AwardsSection,
  NoticeSection,
  OfficeSection,
  PracticeSection,
  PressSection,
  ProfessionalsSection,
  SocialSection,
} from './components/sections/HomeSections'
import { useScrollReveal } from './hooks/useScrollReveal'
import { SiteLayout } from './layouts/SiteLayout'
import './styles/global.css'

function AppClassic() {
  useScrollReveal()
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

  return (
    <BrowserRouter basename={basename}>
      <SiteLayout>
        <VersionSwitch current="classic" />
        <HeroClassic />
        <NoticeSection />
        <AboutSection />
        <PracticeSection />
        <AchievementsSection />
        <ProfessionalsSection />
        <PressSection />
        <AwardsSection />
        <SocialSection />
        <OfficeSection />
      </SiteLayout>
    </BrowserRouter>
  )
}

export default AppClassic
