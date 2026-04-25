const nodemailer = require('nodemailer');

function makeTransport() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
}

async function sendYesEmail(herName, response) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  try {
    await makeTransport().sendMail({
      from   : '"Proposal Site" <' + process.env.EMAIL_USER + '>',
      to     : process.env.NOTIFY_EMAIL || process.env.EMAIL_USER,
      subject: '💖 ' + herName + ' said ' + (response==='yes'?'YES':'OF COURSE') + '!',
      html   : `
        <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;background:#07071a;color:#fff;padding:40px;border-radius:16px;border:1px solid rgba(236,72,153,.3)">
          <h1 style="color:#ec4899;text-align:center;font-size:2rem;margin:0 0 8px">💖 She Said Yes!</h1>
          <p style="text-align:center;color:rgba(255,255,255,.6);margin:0 0 30px">${herName} just answered your proposal</p>
          <div style="background:rgba(255,255,255,.06);border-radius:12px;padding:20px;text-align:center">
            <p style="font-size:1.5rem;margin:0;color:#f9a8d4">Answer: <strong>${response==='yes'?'Yes 💖':'Of Course 💫'}</strong></p>
            <p style="color:rgba(255,255,255,.4);margin:12px 0 0;font-size:.85rem">${new Date().toLocaleString()}</p>
          </div>
          <p style="text-align:center;margin:30px 0 0;color:rgba(255,255,255,.3);font-size:.8rem">Under This Sky, It Was Always You</p>
        </div>
      `,
    });
    console.log('💌  Yes email sent');
  } catch(e) { console.error('Email error:', e.message); }
}

async function sendCommentEmail(data) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  const moodEmoji = { happy:'😊', emotional:'🥹', excited:'💖', shy:'🌸' };
  try {
    await makeTransport().sendMail({
      from   : '"Proposal Site" <' + process.env.EMAIL_USER + '>',
      to     : process.env.NOTIFY_EMAIL || process.env.EMAIL_USER,
      subject: '💌 Barsha left you a message!',
      html   : `
        <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;background:#07071a;color:#fff;padding:40px;border-radius:16px;border:1px solid rgba(167,139,250,.3)">
          <h1 style="color:#a78bfa;text-align:center;font-size:1.6rem;margin:0 0 24px">💌 A Message from Her Heart</h1>
          <div style="background:rgba(255,255,255,.06);border-radius:12px;padding:24px">
            <p style="margin:0 0 8px;color:rgba(255,255,255,.5);font-size:.8rem">FROM</p>
            <p style="margin:0 0 20px;font-size:1.1rem;color:#fff">${data.name}</p>
            <p style="margin:0 0 8px;color:rgba(255,255,255,.5);font-size:.8rem">MESSAGE</p>
            <p style="margin:0 0 20px;font-size:1rem;color:#f9a8d4;font-style:italic;line-height:1.6">"${data.message}"</p>
            <p style="margin:0;color:rgba(255,255,255,.4);font-size:.85rem">Mood: ${moodEmoji[data.mood]||''} ${data.mood} &nbsp;|&nbsp; Rating: ${'⭐'.repeat(data.rating)}</p>
          </div>
          <p style="text-align:center;margin:24px 0 0;color:rgba(255,255,255,.3);font-size:.8rem">${new Date().toLocaleString()}</p>
        </div>
      `,
    });
    console.log('💌  Comment email sent');
  } catch(e) { console.error('Email error:', e.message); }
}

module.exports = { sendYesEmail, sendCommentEmail };
