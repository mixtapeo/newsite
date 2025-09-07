import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import hthBanner from '../../../assets/banners/hth.png';
import synfinyBanner from '../../../assets/banners/synfiny.jpg';

// Simple, data-driven portfolio cards app.
// You can pass a custom `items` prop or edit the defaultItems below.
export default function Portfolio({ items }) {
  const defaultItems = [
    // Projects
    {
      title: 'Capital Technology Networks — VP Software',
      description:
        'Led 2025 UI refresh for Track the Hack; reworked registration/admission/scheduling workflows; built an automated photo booth with email; contributed to HackTheHill III website.',
      subdescription:
        'Really wanted to be a part of something larger than me, and at Capital Technology Networks -- leading and architecturing systems is something I like doing!',
      background: hthBanner,
      tags: ['Leadership', 'Web', 'Automation', 'UI/UX'],
      type: 'project',
      date: "June '25 - Present",
    },
    {
      title: 'Data Augmentation Research — Carleton University',
      description:
        'Boosted YOLOv8-nano to 99.8% top-5 on CIFAR-10 with 99.2% validity via custom Fast AutoAugment policies; co-developing a whitepaper.',
      tags: ['Computer Vision', 'AutoAugment', 'Research'],
      type: 'project',
      date: "February '25 - Present",
    },
    {
      title: 'Quanser ACC 2025 Self-Driving Competition — Participant',
      description:
        'Co-developed navigation algorithms, ROS nodes, lane detection/discipline, and image processing for Stage 2.',
      tags: ['ROS', 'Autonomous Driving', 'Computer Vision'],
      type: 'project',
      date: "June '25 - July '25",
    },
    {
      title: 'ResumeGPT — AI Resume Chatbot',
      description:
        'AI-powered chatbot that processes and summarizes resumes with conversation context. Integrated WildApricot API and OpenAI API; deployed on AWS EC2 (Flask + Gunicorn + Nginx) with cron-based maintenance.',
      date: "June '25",
      repo: 'https://github.com/mixtapeo/ResumeGPT',
      tags: ['Python', 'Flask', 'OpenAI', 'AWS', 'Automation'],
      type: 'project',
    },
    {
      title: 'PepInvent Modified — Peptide Design',
      description:
        'Implemented and customized a deep-learning framework for de novo peptide design to meet project-specific needs; presented findings to faculty.',
      repo: 'https://github.com/mixtapeo/PepInvent-Modified',
      tags: ['Deep Learning', 'Bioinformatics', 'Python'],
      type: 'project',
      date: "February '25 - May '25",
    },
    {
      title: 'Closet Companion — HackTheHill II',
      description:
        'Browser extension that alerts shoppers if a similar item already exists in their wardrobe; OCR-based tagging, MySQL backend, Flask server, and React/Tailwind UI; shipped in 48 hours.',
      href: 'https://devpost.com/software/closet-companion-uym93k',
      tags: [
        'Hackathon',
        'OCR',
        'Flask',
        'React',
        'Firefox Extension',
        'MySQL',
      ],
      type: 'project',
      date: "September '24",
    },

    // Positions
    {
      title: 'Global Head of IT — SynFiny Advisors',
      description:
        'Owned IT security and infrastructure; managed identity/access in Microsoft Entra; optimized Office 365 licensing; ran phishing simulations; drove security decisions; day-to-day IT support. Jun 2025–Present · Remote, USA',
      background: synfinyBanner,
      tags: ['IT', 'Security', 'Microsoft Entra', 'Office 365'],
      type: 'position',
      date: "June '25 - Present",
    },
    {
      title: 'Software Engineering Intern — Infras',
      description:
        'Maintained Playwright + Jenkins E2E framework across client environments; built a DFS-based autonomous form navigator (10+ pages) to eliminate repetitive manual testing. Mar 2025–Present · Remote, USA',
      background:
        'https://cdn.prod.website-files.com/67b4b38e2d5645738ce41c68/68b9f6a16d7921b0bf40453a_img_0.png',
      tags: ['Playwright', 'Jenkins', 'Test Automation'],
      type: 'position',
      date: "March '25 - September '25",
    },
    {
      title: 'Technical Specialist — Mobile Klinik',
      description:
        'Samsung & Apple Certified; WISE L1. Repaired phones, tablets, laptops, and consoles; handled tickets and customers. Jun 2024–Jun 2025 · Ottawa, ON',
      tags: ['Hardware Repair', 'Customer Support', 'Certification'],
      type: 'position',
      date: "June '24 - June '25",
    },
    {
      title: 'Engineering Intern — SynFiny Advisors',
      description:
        'Designed and deployed ResumeGPT on AWS; integrated WildApricot for automated resume ingestion; maintained codebase and roadmap; stakeholder communications. Jul–Sep 2024 · Remote, USA',
      background: synfinyBanner,
      tags: ['Python', 'AWS', 'APIs', 'Flask'],
      type: 'position',
      date: "July '24 - September '24",
    },
  ];
  const data = items && items.length ? items : defaultItems;

  // Derive lists for Projects and Positions while preserving original index for overlay usage
  const itemsWithType = (data || []).map(d => {
    if (d.type) return d;
    const isPosition = /intern|head|specialist|advisor|it|klinik|infras|synfiny/i.test(
      d.title || '',
    );
    return { ...d, type: isPosition ? 'position' : 'project' };
  });
  const projects = itemsWithType
    .map((c, i) => ({ c, i }))
    .filter(x => x.c.type === 'project');
  const positions = itemsWithType
    .map((c, i) => ({ c, i }))
    .filter(x => x.c.type === 'position');

  // Expanded view state
  const [activeIdx, setActiveIdx] = useState(null);
  const [notes, setNotes] = useState({}); // key -> text

  // Scale hero image based on the app window (overlay body) size
  const overlayBodyRef = useRef(null);
  const [heroMaxPx, setHeroMaxPx] = useState(320);
  useEffect(() => {
    const el = overlayBodyRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const h = entries[0]?.contentRect?.height || 0;
      // Use ~40% of overlay body height, clamped between 160px and 520px
      const px = Math.max(160, Math.min(Math.round(h * 0.4), 520));
      setHeroMaxPx(px);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [activeIdx]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolioNotes');
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, []);

  function getKey(idx) {
    const card = data[idx] || {};
    return (card && card.title) || `idx-${idx}`;
  }

  function handleCardClick(idx) {
    setActiveIdx(idx);
  }

  function handleClose() {
    setActiveIdx(null);
  }

  return (
    <Container>
      <ScrollArea>
        <Header>
          <h3>Projects</h3>
          <span>
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </span>
        </Header>
        <Cards>
          {projects.map(({ c, i }) => {
            const bg = c.image || c.background;
            return (
              <Card key={i} onClick={() => handleCardClick(i)} $bg={bg}>
                {/* ...no thumbnail; background image applied via Card... */}
                <Body $onImage={Boolean(bg)}>
                  <Title $onImage={Boolean(bg)}>{c.title}</Title>
                  {c.tags && c.tags.length > 0 && (
                    <Tags>
                      {c.tags.map((t, idxTag) => (
                        <Tag key={`${t}-${idxTag}`}>{t}</Tag>
                      ))}
                    </Tags>
                  )}
                  <Desc $onImage={Boolean(bg)}>{c.description}</Desc>
                  <Actions>
                    {c.href && (
                      <Button
                        as="a"
                        href={c.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                      >
                        Open
                      </Button>
                    )}
                    {c.repo && (
                      <ButtonSecondary
                        as="a"
                        href={c.repo}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                      >
                        GitHub
                      </ButtonSecondary>
                    )}
                  </Actions>
                </Body>
                {c.date && <DateTag $onImage={Boolean(bg)}>{c.date}</DateTag>}
              </Card>
            );
          })}
        </Cards>
        <Header>
          <h3>Positions</h3>
          <span>
            {positions.length} position{positions.length !== 1 ? 's' : ''}
          </span>
        </Header>
        <Cards>
          {positions.map(({ c, i }) => {
            const bg = c.image || c.background;
            return (
              <Card key={i} onClick={() => handleCardClick(i)} $bg={bg}>
                {/* ...no thumbnail; background image applied via Card... */}
                <Body $onImage={Boolean(bg)}>
                  <Title $onImage={Boolean(bg)}>{c.title}</Title>
                  {c.tags && c.tags.length > 0 && (
                    <Tags>
                      {c.tags.map((t, idxTag) => (
                        <Tag key={`${t}-${idxTag}`}>{t}</Tag>
                      ))}
                    </Tags>
                  )}
                  <Desc $onImage={Boolean(bg)}>{c.description}</Desc>
                  <Actions>
                    {c.href && (
                      <Button
                        as="a"
                        href={c.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                      >
                        Open
                      </Button>
                    )}
                    {c.repo && (
                      <ButtonSecondary
                        as="a"
                        href={c.repo}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                      >
                        GitHub
                      </ButtonSecondary>
                    )}
                  </Actions>
                </Body>
                {c.date && <DateTag $onImage={Boolean(bg)}>{c.date}</DateTag>}
              </Card>
            );
          })}
        </Cards>
      </ScrollArea>
      {activeIdx != null && (
        <Overlay>
          <OverlayHeader>
            <div className="title">{data[activeIdx]?.title || 'Details'}</div>
            <div className="actions">
              {data[activeIdx]?.href && (
                <Button
                  as="a"
                  href={data[activeIdx].href}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open
                </Button>
              )}
              {data[activeIdx]?.repo && (
                <ButtonSecondary
                  as="a"
                  href={data[activeIdx].repo}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </ButtonSecondary>
              )}
              <CloseButton onClick={handleClose}>Close</CloseButton>
            </div>
          </OverlayHeader>
          <OverlayBody ref={overlayBodyRef}>
            {(data[activeIdx]?.image || data[activeIdx]?.background) && (
              <Hero
                src={data[activeIdx].image || data[activeIdx].background}
                alt={data[activeIdx].title}
                style={{ maxHeight: heroMaxPx }}
              />
            )}
            <LargeDesc>
              {data[activeIdx]?.description || 'No description provided.'}
            </LargeDesc>
            {data[activeIdx]?.subdescription && (
              <SubDesc>{data[activeIdx].subdescription}</SubDesc>
            )}
          </OverlayBody>
        </Overlay>
      )}
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to right, #edede5 0%, #ede8cd 100%);
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px 0;
  color: #0c327d;
  h3 {
    margin: 0;
    font-size: 14px;
  }
  span {
    font-size: 11px;
    opacity: 0.8;
  }
`;

const Cards = styled.div`
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  overflow: visible;
`;

const Card = styled.div`
  background: ${p => (p.$bg ? `url(${p.$bg}) center/cover no-repeat` : '#fff')};
  border: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-height: 170px;
  ${p =>
    p.$bg &&
    `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%);
      pointer-events: none;
    }
  `}
`;

// Thumbnail no longer used for cards; kept here in case other parts reference it
const Thumb = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const Body = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  z-index: 1;
`;

const Title = styled.div`
  font-weight: bold;
  color: ${p => (p.$onImage ? '#fff' : '#0c327d')};
  text-shadow: ${p => (p.$onImage ? '0 1px 2px rgba(0,0,0,0.6)' : 'none')};
  font-size: 13px;
`;

const Desc = styled.div`
  font-size: 12px;
  color: ${p => (p.$onImage ? '#fff' : '#222')};
  text-shadow: ${p => (p.$onImage ? '0 1px 2px rgba(0,0,0,0.6)' : 'none')};
  line-height: 1.35;
`;

const Tags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  font-size: 10px;
  color: #0c327d;
  background: #e6efff;
  border: 1px solid #96abff;
  padding: 1px 6px;
  border-radius: 10px;
`;

const DateTag = styled.div`
  position: absolute;
  right: 8px;
  bottom: 8px;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  pointer-events: none;
  color: ${p => (p.$onImage ? '#fff' : '#0c327d')};
  background: ${p => (p.$onImage ? 'rgba(0,0,0,0.55)' : '#e6efff')};
  border: 1px solid ${p => (p.$onImage ? 'rgba(255,255,255,0.35)' : '#96abff')};
  text-shadow: ${p => (p.$onImage ? '0 1px 2px rgba(0,0,0,0.6)' : 'none')};
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 6px;
`;

const Button = styled.button`
  appearance: none;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 2px;
  border: 1px solid #7d96ff;
  background: linear-gradient(to bottom, #f5f8ff 0%, #dfe8ff 100%);
  color: #0b61ff;
  cursor: pointer;
  &:hover {
    filter: brightness(1.03);
  }
  &:active {
    transform: translateY(1px);
  }
`;

const ButtonSecondary = styled(Button)`
  border-color: #b6b6b6;
  background: linear-gradient(to bottom, #fefefe 0%, #f0f0f0 100%);
  color: #333;
`;

// Full-window overlay inside this app window
const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6);
  z-index: 100; /* ensure overlay sits above cards */
`;

const OverlayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: linear-gradient(to right, #e6efff 0%, #cbd8ff 100%);
  border-bottom: 1px solid #96abff;
  .title {
    font-weight: bold;
    color: #0c327d;
  }
  .actions {
    display: flex;
    gap: 8px;
  }
`;

const OverlayBody = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const Hero = styled.img`
  width: 100%;
  /* max-height is set dynamically via inline style based on overlay size */
  object-fit: cover;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const LargeDesc = styled.div`
  padding: 10px 12px 0;
  color: #222;
  font-size: 13px;
`;

const SubDesc = styled.div`
  padding: 6px 12px 0;
  color: #333;
  font-size: 12px;
  opacity: 0.9;
`;

const Editor = styled.textarea`
  flex: 1;
  margin: 10px 12px 12px;
  border: 1px solid #96abff;
  background: #fff;
  outline: none;
  resize: none;
  border-radius: 2px;
  font-family: 'Lucida Console', monospace;
  font-size: 13px;
  line-height: 1.35;
`;

const CloseButton = styled(Button)`
  border-color: #b74c4c;
  color: #8b0000;
  background: linear-gradient(to bottom, #fff5f5 0%, #ffe0e0 100%);
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;
