-- Create templates table for reusable document templates
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_type TEXT NOT NULL CHECK (template_type IN ('invoice', 'quotation', 'checksheet')),
  name TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin read templates" ON templates
  FOR SELECT USING (true);

CREATE POLICY "Allow admin insert templates" ON templates
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin update templates" ON templates
  FOR UPDATE USING (true);

CREATE POLICY "Allow admin delete templates" ON templates
  FOR DELETE USING (true);

-- Insert default templates
INSERT INTO templates (template_type, name, content, is_default) VALUES
(
  'invoice',
  'Standard Invoice Template',
  '{
    "company_name": "Fenix Car Hire",
    "company_address": "P.O. Box 7909 Mbabane, Eswatini",
    "company_phone": "(+268) 2422 1045",
    "company_email": "reception@fenix.co.sz",
    "bank_name": "Standard Bank Swaziland",
    "account_name": "Semperfi Investments (Pty)",
    "account_number": "911000568957",
    "branch_code": "663164",
    "vat_rate": 15
  }',
  true
),
(
  'quotation',
  'Standard Quotation Template',
  '{
    "company_name": "Fenix Car Hire",
    "company_address": "P.O. Box 7909 Mbabane, Eswatini",
    "company_phone": "(+268) 2422 1045",
    "company_email": "reception@fenix.co.sz",
    "bank_name": "Standard Bank Swaziland",
    "account_name": "Semperfi Investments (Pty)",
    "account_number": "911000568957",
    "branch_code": "663164",
    "vat_rate": 15
  }',
  true
),
(
  'checksheet',
  'Vehicle Check Sheet Template',
  '{
    "company_name": "Fenix Car Hire",
    "company_address": "P.O. Box 7909 Mbabane, Eswatini",
    "company_phone": "(+268) 2422 1045",
    "pre_rental_checklist": ["Windscreen", "Headlights", "Taillights", "Valid License", "Service Book", "Mirrors", "Radio", "Mats", "Carpets", "Spare Wheel", "Seat Condition", "Ashtray/Lighter", "Spare Brand Type"],
    "damage_types": ["D-DENT", "C-CHIP", "SC-SCRAPE", "C-CRACK", "SR-SCRATCHES"]
  }',
  true
);
