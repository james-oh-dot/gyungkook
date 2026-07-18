import { Gnb } from './components/Gnb'
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
import './styles/global.css'

function App() {
  useScrollReveal()

  return (
    <main className="page">
      <Gnb />
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
    </main>
  )
}

export default App
