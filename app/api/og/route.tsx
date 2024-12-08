import { ImageResponse } from '@vercel/og';
 
export const runtime = 'edge';
 
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
        }}
      >
        <h1 style={{ fontSize: 60, margin: 0 }}>ROAST MY WALLET</h1>
        <p style={{ fontSize: 30, opacity: 0.8 }}>Get your wallet roasted</p>
        <div style={{ fontSize: 60, marginTop: 20 }}>🔥</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
} 