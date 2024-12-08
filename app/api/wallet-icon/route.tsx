import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

const size = {
  width: 48,
  height: 48,
};

export async function GET() {
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
          fontSize: 32,
          fontWeight: 'bold',
          color: 'white',
          padding: '4px',
        }}
      >
        🔥
      </div>
    ),
    {
      width: size.width,
      height: size.height
    }
  );
} 