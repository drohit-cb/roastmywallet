import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          color: 'white',
        }}
      >
        🔥
      </div>
    ),
    {
      ...size,
    }
  );
} 