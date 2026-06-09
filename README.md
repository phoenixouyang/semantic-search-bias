# AI in Recruitment: Measuring Gender Bias in Job Title Embeddings

Research paper and experiment code exploring how AI recruitment tools can perpetuate historical bias through proxy discrimination.

## Paper

**AI in Recruitment: Measuring Bias and Designing for Transparency**
Phoenix Ouyang · Seneca Polytechnic · April 2026

📄 [Read the full paper (PDF)](./AI%20In%20Recruitment.pdf)

## About

This project investigates whether gender bias exists at the foundational model level in language embeddings used by AI recruitment tools. While much of the debate around AI hiring focuses on how models are fine-tuned or what data is fed into screening algorithms, this experiment tests a more fundamental question: do the underlying embedding models already carry gendered associations for job titles?

## Experiment

100 job titles spanning diverse industries and seniority levels were embedded using two models:

- **Google Gemini Embedding 001**
- **OpenAI Text Embedding 3 Small**

Cosine similarity was calculated between each job title and the gender terms "Female" and "Male." Raw scores were normalized to z-scores to control for terms that naturally sit closer to all job titles in embedding space. A final association score was computed as the difference between male and female z-scores.

### Key Findings

| Finding | Detail |
|---------|--------|
| Overall split | 49 titles leaned female, 51 leaned male |
| Management titles | All skewed male in both models |
| Admin/HR titles | All skewed female in both models |
| Most female-associated | Medical Receptionist (−1.87) |
| Most male-associated | Judge (+1.64) |

## Why It Matters

These biases exist in the embedding layer — before any hiring-specific logic is applied. AI recruitment systems built on these models could reproduce discriminatory patterns even when protected characteristics are excluded from inputs, through a mechanism known as **proxy discrimination**.

## Tech Stack

- TypeScript (main program)
- Google Gemini Embedding API
- OpenAI Embedding API
- Microsoft Excel (analysis and visualization)

## Paper Topics

- Public sentiment on AI in hiring
- Benefits and risks of AI recruitment tools
- Proxy discrimination and the Mobley v. Workday lawsuit
- Amazon's discontinued AI hiring tool
- Explainable AI (XAI) and the Autorubric evaluation framework
- Policy responses (Ontario's Working for Workers Four Act)

## License

This research was completed as part of the AIP444 course at Seneca Polytechnic. Code is available for educational and reference purposes.
