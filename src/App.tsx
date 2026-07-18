import { Hero } from './components/Hero'
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

function App() {
  useScrollReveal()

  return (
    <SiteLayout>
      <VersionSwitch current="teal" />
      <Hero />
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
  )
}

export default App
