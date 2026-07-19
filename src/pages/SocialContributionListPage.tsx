import { SocialGridCard } from '../components/sub/SocialGridCard'
import {
  SOCIAL_CONTRIBUTION_PAGE,
  socialPostDetailPath,
  socialPosts,
} from '../data/socialContribution'

/**
 * 사회공헌 list — intro + 4/2/1 card grid (Figma SUB_활동보도_사회공헌_*).
 */
export function SocialContributionListPage() {
  const posts = socialPosts()

  return (
    <div className="social-contribution__contents" data-name="Contents">
      <header className="social-contribution__intro" aria-labelledby="social-board-title">
        <div className="social-contribution__intro-head" data-name="Block_left">
          <p className="social-contribution__en">{SOCIAL_CONTRIBUTION_PAGE.enLabel}</p>
          <h2 id="social-board-title" className="social-contribution__title">
            {SOCIAL_CONTRIBUTION_PAGE.title}
          </h2>
        </div>
        <div className="social-contribution__intro-body" data-name="block_right">
          {SOCIAL_CONTRIBUTION_PAGE.intro.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
      </header>

      <section
        className="social-contribution__list"
        data-name="Contents"
        aria-label="사회공헌 목록"
      >
        <ul className="social-contribution__grid" data-name="list_wrap">
          {posts.map((post) => (
            <li key={post.id}>
              <SocialGridCard post={post} detailPath={socialPostDetailPath} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
