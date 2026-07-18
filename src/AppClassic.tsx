import { Gnb } from './components/Gnb'
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
import './styles/global.css'

function AppClassic() {
  useScrollReveal()

  return (
    <main className="page">
      <Gnb />
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
    </main>
  )
}

export default AppClassic
