import { HeroClassic } from '../components/HeroClassic'
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
} from '../components/sections/HomeSections'
import { useScrollReveal } from '../hooks/useScrollReveal'

/** Dark classic hero is now the single default home direction. */
export function HomePage() {
  useScrollReveal()

  return (
    <>
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
    </>
  )
}
