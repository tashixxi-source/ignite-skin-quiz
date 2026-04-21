const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function analyzeSkin(answers) {
  const scores = { oily: 0, dry: 0, normal: 0, combination: 0, sensitive: 0 };

  const q1 = answers.q1;
  if (q1 === 'tight') { scores.dry += 3; }
  else if (q1 === 'comfortable') { scores.normal += 3; }
  else if (q1 === 'shiny') { scores.oily += 3; }
  else if (q1 === 'mixed') { scores.combination += 3; }
  else if (q1 === 'red') { scores.sensitive += 3; }

  const q2 = answers.q2;
  if (q2 === 'matte') { scores.normal += 2; scores.dry += 1; }
  else if (q2 === 'oily_all') { scores.oily += 3; }
  else if (q2 === 'oily_t') { scores.combination += 3; }
  else if (q2 === 'flaky') { scores.dry += 3; }
  else if (q2 === 'reactive') { scores.sensitive += 3; }

  const q3 = answers.q3;
  if (q3 === 'invisible') { scores.dry += 2; scores.normal += 1; }
  else if (q3 === 'small') { scores.normal += 2; }
  else if (q3 === 'medium') { scores.combination += 2; }
  else if (q3 === 'large') { scores.oily += 2; }

  const q4 = answers.q4;
  if (q4 === 'never') { scores.dry += 1; scores.normal += 1; }
  else if (q4 === 'sometimes') { scores.combination += 1; scores.sensitive += 1; }
  else if (q4 === 'often_t') { scores.combination += 2; scores.oily += 1; }
  else if (q4 === 'often_all') { scores.oily += 2; }

  const q5 = answers.q5;
  if (q5 === 'fine') { scores.normal += 2; scores.oily += 1; }
  else if (q5 === 'breakout') { scores.oily += 1; scores.combination += 1; }
  else if (q5 === 'irritate') { scores.sensitive += 3; }
  else if (q5 === 'dry_more') { scores.dry += 2; }

  const q6 = answers.q6;
  if (q6 === 'dull') { scores.dry += 1; scores.normal += 1; }
  else if (q6 === 'pores') { scores.oily += 2; scores.combination += 1; }
  else if (q6 === 'dry_tight') { scores.dry += 3; }
  else if (q6 === 'sensitive_red') { scores.sensitive += 3; }
  else if (q6 === 'acne') { scores.oily += 2; }

  const skinType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = Math.round((scores[skinType] / total) * 100);

  const results = {
    oily: {
      skinType: 'Oily',
      skinTypeThaiName: 'ผิวมัน',
      description: 'ผิวของคุณผลิตน้ำมันมากกว่าปกติ ทำให้หน้ามันเงาตลอดวัน รูขุมขนมีแนวโน้มอุดตันและเป็นสิวง่าย ควรเลือก skincare ที่เป็น oil-free และไม่อุดตันรูขุมขน',
      morningRoutine: ['ล้างหน้าด้วย foaming cleanser ลด sebum', 'Toner ที่มี BHA หรือ niacinamide', 'Moisturizer เนื้อ gel บางเบา', 'กันแดด SPF 50+ สูตร oil-free'],
      eveningRoutine: ['Double cleanse — cleansing oil ก่อน แล้วตามด้วย foam', 'Exfoliate ด้วย BHA 2-3 ครั้ง/สัปดาห์', 'Niacinamide serum ลดรูขุมขน', 'Moisturizer เนื้อ gel เบาๆ'],
      igniteTip: 'IGNITE ช่วยติดตาม routine เช้า-เย็น และแจ้งเตือนวันที่ถึงเวลา exfoliate'
    },
    dry: {
      skinType: 'Dry',
      skinTypeThaiName: 'ผิวแห้ง',
      description: 'ผิวของคุณขาดความชุ่มชื้น ทำให้รู้สึกตึงและอาจลอกได้ ต้องการ moisturizer ที่เข้มข้นและ hydrating ingredients เช่น hyaluronic acid และ ceramide',
      morningRoutine: ['ล้างหน้าด้วย cream cleanser อ่อนโยน', 'Hyaluronic acid serum ขณะผิวยังชื้น', 'Moisturizer เนื้อครีมเข้มข้น', 'กันแดด SPF 50+ สูตร moisturizing'],
      eveningRoutine: ['ล้างหน้าด้วย cleansing balm หรือ cream', 'Hydrating toner', 'Retinol เบาๆ 1-2 ครั้ง/สัปดาห์', 'Rich moisturizer หรือ sleeping mask'],
      igniteTip: 'IGNITE ช่วยเตือนให้ดื่มน้ำและติดตาม routine บำรุงผิวทุกวัน'
    },
    normal: {
      skinType: 'Normal',
      skinTypeThaiName: 'ผิวปกติ',
      description: 'ผิวของคุณสมดุลดีมาก ไม่มันไม่แห้งจนเกินไป รูขุมขนเล็ก และไม่ค่อยมีปัญหาผิว เป้าหมายคือ maintain ความสมดุลนี้ไว้และป้องกันริ้วรอยล่วงหน้า',
      morningRoutine: ['ล้างหน้าด้วย gentle cleanser', 'Vitamin C serum ป้องกัน oxidation', 'Lightweight moisturizer', 'กันแดด SPF 50+'],
      eveningRoutine: ['ล้างหน้าให้สะอาด', 'Toner บำรุง', 'Retinol 2-3 ครั้ง/สัปดาห์', 'Moisturizer'],
      igniteTip: 'IGNITE ช่วยสร้าง routine ที่สม่ำเสมอเพื่อ maintain ผิวดีในระยะยาว'
    },
    combination: {
      skinType: 'Combination',
      skinTypeThaiName: 'ผิวผสม',
      description: 'ผิวของคุณมันที่บริเวณ T-zone แต่ปกติหรือแห้งที่แก้ม ต้องการ routine ที่สมดุล อาจต้องใช้ผลิตภัณฑ์ต่างกันในแต่ละโซน',
      morningRoutine: ['ล้างหน้าด้วย gentle foaming cleanser', 'Toner ปรับสมดุล pH', 'Lightweight moisturizer ทั้งหน้า', 'กันแดด SPF 50+'],
      eveningRoutine: ['Double cleanse', 'BHA เฉพาะ T-zone', 'Moisturizer — บางที่ T-zone หนักที่แก้ม', 'Eye cream'],
      igniteTip: 'IGNITE ช่วยแยก routine T-zone และแก้มให้ชัดเจน ไม่ข้ามขั้นตอน'
    },
    sensitive: {
      skinType: 'Sensitive',
      skinTypeThaiName: 'ผิวแพ้ง่าย',
      description: 'ผิวของคุณไวต่อสิ่งกระตุ้น ทำให้แดงและระคายเคืองได้ง่าย ควรเลือก skincare ที่ fragrance-free และมี ingredients น้อยชิ้น หลีกเลี่ยง active ingredients แรงๆ',
      morningRoutine: ['ล้างหน้าด้วย fragrance-free cream cleanser', 'Centella asiatica serum ลดการอักเสบ', 'Moisturizer สำหรับผิวแพ้ง่าย', 'กันแดด mineral SPF 50+'],
      eveningRoutine: ['ล้างหน้าอ่อนโยน ไม่ถูแรง', 'Calming toner เช่น rose water', 'Barrier repair moisturizer', 'หลีกเลี่ยง retinol — ใช้ bakuchiol แทน'],
      igniteTip: 'IGNITE ช่วยบันทึก skin reaction เพื่อหาสาเหตุที่ทำให้ผิวแพ้'
    }
  };

  const result = results[skinType];
  return {
    ...result,
    confidence: confidence + '%'
  };
}

app.post('/api/analyze', (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers) return res.status(400).json({ error: 'No answers provided' });

    const parsed = {};
    answers.split('\n').forEach(line => {
      if (line.includes('After washing')) parsed.q1 = line.split(': ')[1];
      else if (line.includes('Midday')) parsed.q2 = line.split(': ')[1];
      else if (line.includes('Pore')) parsed.q3 = line.split(': ')[1];
      else if (line.includes('Acne')) parsed.q4 = line.split(': ')[1];
      else if (line.includes('Reaction')) parsed.q5 = line.split(': ')[1];
      else if (line.includes('concern')) parsed.q6 = line.split(': ')[1];
      else if (line.includes('routine')) parsed.q7 = line.split(': ')[1];
    });

    const result = analyzeSkin(parsed);
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
