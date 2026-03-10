-- Maps committees to policy issues
-- Run after seed:committees has populated the committees table
INSERT INTO committee_issue (committee_id, issue_id)
SELECT c.id, i.id FROM committees c, issues i
WHERE
  -- taxes: finance, ways & means, budget, taxation, appropriations
  (i.name = 'taxes' AND c.thomas_id IN ('SSFI', 'HSWM', 'SSBU', 'HSBU', 'JSTX', 'HSAP', 'SSAP'))
  -- abortion: judiciary, health
  OR (i.name = 'abortion' AND c.thomas_id IN ('SSJU', 'HSJU', 'SSHR', 'HSIF'))
  -- drug prices: health, energy/commerce, finance, ways & means
  OR (i.name = 'drug prices' AND c.thomas_id IN ('SSHR', 'HSIF', 'SSFI', 'HSWM'))
  -- climate change: environment, energy, science, natural resources
  OR (i.name = 'climate change' AND c.thomas_id IN ('SSEV', 'SSEG', 'HSIF', 'HSSY', 'HSII'))
  -- zoning: banking/housing, transportation/infrastructure
  OR (i.name = 'zoning' AND c.thomas_id IN ('SSBK', 'HSBA', 'HSPW'))
  -- housing: banking/housing, appropriations
  OR (i.name = 'housing' AND c.thomas_id IN ('SSBK', 'HSBA', 'SSAP', 'HSAP'))
ON CONFLICT DO NOTHING;
