import { Hero } from '../components/Hero'
import { VersionSwitch } from '../components/VersionSwitch'
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

/** Teal home (default `/`). */
export function HomePage() {
  useScrollReveal()

  return (
    <>
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
    </>
  )
}
