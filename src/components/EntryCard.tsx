'use client';

import Link from 'next/link';

interface EntryCardProps {
  id: string;
  week: number;
  title: string;
  excerpt: string;
  coverImage?: string;
  date?: string;
  index?: number;
}

const cardStyles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
  },
  imageWrap: {
    position: 'relative' as const,
    width: '100%',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
    background: 'var(--bg-surface-alt)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  imageOverlay: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    background: 'linear-gradient(to top, var(--bg-surface), transparent)',
    pointerEvents: 'none' as const,
  },
  weekBadge: {
    position: 'absolute' as const,
    top: '12px',
    left: '12px',
  },
  body: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    flex: 1,
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
    transition: 'color 0.25s',
  },
  excerpt: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  },
  date: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    marginTop: 'auto',
    paddingTop: '12px',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-surface-hover))',
    color: 'var(--accent)',
    fontSize: '2rem',
    fontWeight: 800,
    opacity: 0.3,
  },
};

export default function EntryCard({
  id,
  week,
  title,
  excerpt,
  coverImage,
  date,
  index = 0,
}: EntryCardProps) {
  return (
    <Link
      href={`/entry/${id}`}
      className="glass-card animate-fade-in"
      style={{
        ...cardStyles.card,
        animationDelay: `${index * 0.08}s`,
      }}
      id={`entry-card-${id}`}
    >
      <div style={cardStyles.imageWrap}>
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            style={cardStyles.image}
            className="card-image"
          />
        ) : (
          <div style={cardStyles.placeholder}>W{week}</div>
        )}
        <div style={cardStyles.imageOverlay} />
        <div style={cardStyles.weekBadge}>
          <span className="badge badge-accent">Week {week}</span>
        </div>
      </div>
      <div style={cardStyles.body}>
        <h3 style={cardStyles.title} className="card-title">{title}</h3>
        <p style={cardStyles.excerpt}>{excerpt}</p>
        {date && <span style={cardStyles.date}>{date}</span>}
      </div>

      <style jsx>{`
        .glass-card:hover .card-image {
          transform: scale(1.05);
        }
        .glass-card:hover .card-title {
          color: var(--accent);
        }
      `}</style>
    </Link>
  );
}
