import { Outlet } from 'react-router-dom'
import { SubVisual } from '../components/sub/SubVisual'
import { SOCIAL_CONTRIBUTION_PAGE } from '../data/socialContribution'
import {
  LOCAL_TABS_ANCHOR_ID,
  useScrollToLocalTabs,
} from '../hooks/useScrollToLocalTabs'
import './SocialContribution.css'

/**
 * Shell for 사회공헌 list + detail (sub-04-04).
 * No LocalTabs — single board. Anchor keeps detail scroll under GNB.
 */
export function SocialContributionLayout() {
  useScrollToLocalTabs()

  return (
    <div className="social-contribution" data-name="SUB_활동보도_사회공헌">
      <div className="social-contribution__visual" data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={SOCIAL_CONTRIBUTION_PAGE.parentLabel}
          title={SOCIAL_CONTRIBUTION_PAGE.title}
          image={SOCIAL_CONTRIBUTION_PAGE.visual}
          imagePreview={SOCIAL_CONTRIBUTION_PAGE.visualPreview}
          visualKey="sub-04-04"
          showChip={false}
        />
      </div>
      <div
        id={LOCAL_TABS_ANCHOR_ID}
        className="social-contribution__anchor"
        aria-hidden="true"
      />
      <div className="social-contribution__main">
        <Outlet />
      </div>
    </div>
  )
}
