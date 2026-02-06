import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, Clock, IndianRupee, FileText, Filter, BadgeCheck, ChevronRight, ShoppingCart, Check, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/stores/useCartStore';
import { getServiceId } from '@/utils/serviceIdMap';

// Services data from catalog - restructured to support service variants
const servicesData = [
    {
        category: "Income Tax",
        services: [
            {
                title: "Capital Gains Tax Planning",
                price: 4999,
                tat: "5-10 days",
                variants: [
                    {
                        name: "Reinvestment Planning as per IT Act",
                        tat: "5 days",
                        documents: "PAN Card of the Assessee\nAadhaar Card\nNature of transaction planning documents\nPurchase and sale of property documents"
                    },
                    {
                        name: "Property Revaluation",
                        tat: "10 days (subject to valuer)",
                        documents: "Registered Sale Deed/Title Deed\nProperty Tax Receipt\nBuilding Plan\nProperty Photographs\nUtility Bills\nCompletion/Occupancy Certificate\nRent Agreement\nComparable Properties Details\nPAN & Aadhaar of Owner"
                    }
                ]
            },
            {
                title: "Income Tax E-Filing",
                price: 999,
                tat: "1-2 days",
                documents: "PAN Card\nAadhaar Card\nForm 16/16A\nBank Statements\nInvestment Proofs (80C, 80D, etc.)"
            },
            {
                title: "Business Tax Filing",
                price: 4999,
                tat: "3-5 days",
                documents: "PAN Card of Business\nBalance Sheet & P&L Account\nBank Statements\nGST Returns (if applicable)\nPrevious Year ITR"
            },
            {
                title: "Partnership Firm / LLP ITR",
                price: 7499,
                tat: "5-7 days",
                documents: "Partnership Deed/LLP Agreement\nPAN of Firm/LLP\nAudited Financials\nPartner Details\nDigital Signature"
            },
            {
                title: "Company ITR Filing",
                price: 9999,
                tat: "7-10 days",
                documents: "Certificate of Incorporation\nAudited Balance Sheet & P&L\nDirector Details & KYC\nDigital Signature (Class 3)\nForm 26AS"
            },
            {
                title: "Trust / NGO Tax Filing",
                price: 7499,
                tat: "7-10 days",
                documents: "Trust Deed/Registration Certificate\nPAN of Trust/NGO\nAudit Report (Form 10B/10BB)\nDonor List\nUtilization Certificate"
            },
            {
                title: "15CA - 15CB Filing",
                price: 4999,
                tat: "1-2 days",
                documents: "Invoice for foreign payment\nRemittee details\nTRC of remittee\nAgreement/Contract copy\nBank account details"
            },
            {
                title: "TAN Registration",
                price: 999,
                tat: "1-2 days",
                documents: "PAN of Entity\nIdentity Proof of Authorized Signatory\nAddress Proof of Business\nDigital Signature"
            },
            {
                title: "TDS Return Filing",
                price: 1499,
                tat: "2-3 days",
                documents: "TAN Details\nTDS Challans\nList of Deductees with PAN\nAmount Paid & Date of Deduction"
            },
            {
                title: "Revised ITR Return (ITR-U)",
                price: 2499,
                tat: "2-4 days",
                documents: "Original ITR Acknowledgement\nDetails of additional income\nTax payment challans (if any)\nReason for revision"
            }
        ]
    },
    {
        category: "GST",
        services: [
            {
                title: "GST Registration",
                price: 2999,
                tat: "7-10 days",
                documents: "PAN Card of Business/Proprietor\nAadhaar Card\nPassport-size Photograph\nAddress Proof (Utility Bill/Tax Receipt)\nBank Account Proof (Cancelled Cheque/Passbook)\nDigital Signature (if applicable)\nRent Agreement & NOC"
            },
            {
                title: "GST Registration for Foreigners",
                price: 9999,
                tat: "10-15 days",
                documents: "Passport (Attested)\nProof of Address in home country\nIndian Nominee Details & ID\nBusiness Activity description"
            },
            {
                title: "GST Return Filing by Accountant",
                price: 1499,
                tat: "Monthly/Quarterly",
                documents: "Sales Invoices\nPurchase Invoices\nBank Statement\nPrevious Month GSTR-3B/1"
            },
            {
                title: "GST Invoicing & Filing Software",
                price: 4999,
                tat: "Instant Access",
                documents: "Business setup details\nGSTIN"
            },
            {
                title: "GST NIL Return Filing",
                price: 499,
                tat: "1 day",
                documents: "Login Credentials\nOTP for verification"
            },
            {
                title: "GST Amendment",
                price: 1999,
                tat: "3-5 days",
                documents: "New Address Proof (if changing address)\nPartner/Director details (if changing constitution)\nSupporting evidence for amendment"
            },
            {
                title: "GST E-Invoicing Software",
                price: 5999,
                tat: "Instant Access",
                documents: "GSTIN\nAPI access credentials"
            },
            {
                title: "GST Revocation",
                price: 4999,
                tat: "15-30 days",
                documents: "GST Cancellation Order\nAll pending Tax Returns\nReason for Revocation\nAffidavit (if required)"
            },
            {
                title: "GST LUT Form",
                price: 999,
                tat: "1-2 days",
                documents: "GSTIN\nDigital Signature\nWitness Details\nPrevious year fulfillment details"
            },
            {
                title: "GSTR-10 (Final Return)",
                price: 2999,
                tat: "5-7 days",
                documents: "Order of Cancellation\nDetails of Closing Stock\nGST payable on closing stock"
            },
            {
                title: "GST Software for Accountants",
                price: 14999,
                tat: "Instant Access",
                documents: "Accountant/CA Firm registration details"
            },
            {
                title: "GST Annual Return Filing (GSTR-9)",
                price: 4999,
                tat: "10-15 days",
                documents: "Annual Financial Statements\nGSTR-1 & 3B data for the financial year\nGST Reconciliation statements"
            },
            {
                title: "Virtual Office + GSTIN",
                price: 15000,
                tat: "7-10 days",
                documents: "Identity and Address proof of owner/directors\nNOC from virtual office provider\nService Agreement"
            }
        ]
    },
    {
        category: "TDS Planning",
        services: [
            {
                title: "Lower TDS Certificate (LDC) u/s 197 for NRIs",
                price: 49999,
                name: "Lower TDS Certificate (LDC) u/s 197 for NRIs",
                tat: "25-30 days (after docs submission)",
                documents: "PAN Card\nTax Residency Certificate (TRC)\nPassport and Visa Copies\nBank Statement (India and Foreign)\nIncome Tax Returns (last 2-3 years)\nDetails of Income\nSale/Purchase Agreements (if applicable)\nProof of Investment" + "\n" + "Further requirements will be shared after receiving above documents*"
            }
        ]
    },
    {
        category: "Trust Services",
        services: [
            {
                title: "Trust",
                price: 49999,
                tat: "15-20 days",
                variants: [
                    {
                        name: "Maintenance of Accounts",
                        tat: "10-15 working days",
                        documents: "Expense Voucher\nCash Books\nDonation Receipts\nBank statements"
                    },
                    {
                        name: "Tax Compliance & Related Matters",
                        tat: "15 days",
                        documents: "Trust Deed (Registered Copy)\nPAN of the Trust\n12A/12AA Registration Certificate\n80G Certificate\nForm 10B Audit Report\nAnnual Financial Statements\nBank Statements of the Trust\nDonation Receipts Issued\nDetails of Donors\nUtilization of Donations\nList of Trustees with PAN & Address\nFCRA Registration\nGST Registration & Returns\nInvestment Details\nBoard Meeting Resolutions"
                    }
                ]
            }
        ]
    },
    {
        category: "Capital Gains & Tax Planning",
        services: [
            {
                title: "Filing 26QB",
                price: 4999,
                description: "TDS on property purchase > ₹50L",
                tat: "1-2 days",
                documents: "PAN of Buyer\nPAN of Seller\nAadhaar of Buyer and Seller\nAddress of Buyer and Seller\nSale Agreement/Deed Copy\nDate of Agreement/Transaction\nMode of Payment\nContact details\nLogin Credentials for Income tax Site"
            },
            {
                title: "Tax Planning Consultation",
                price: 4999,
                tat: "1-3 days",
                documents: "PAN Card\nAadhaar Card\nIncome Tax Returns (last 2–3 years)\nForm 16 / Salary Slips (for salaried individuals)\nBank Statements (last 6 months)\nInvestment Proofs (LIC, PPF, ELSS, etc.)\nDetails of Capital Gains (property, shares, mutual funds)\nRental Income Details (if any)\nHome Loan Documents (sanction letter, EMI schedule)\nBusiness Income/Profit & Loss Account (if self-employed)\nBalance Sheet (for businesses or professionals)\nDetails of Foreign Income/Assets (if applicable)\nAdvance Tax / Self-Assessment Tax Paid\nTDS Certificates (Form 16A, etc.)\nDetails of Donations (for 80G deductions)\nEducation Loan Details (interest certificate)\nMedical Insurance Premium Receipts (80D)\nHouse Rent Receipts (if claiming HRA)\nDepreciation Schedule (for businesses)\nAny Pending Tax Notices/Communications from IT Dept\nFurther requirements, if any, will be shared after receiving above documents*"
            }
        ]
    },
    {
        category: "Registration",
        services: [
            {
                title: "PAN Registration (Individual/Company)",
                price: 499,
                tat: "1-2 days",
                documents: "INDIVIDUAL\nProof of Identity (Aadhaar Card / Passport / Voter ID / Driving License)\nProof of Address (Aadhaar / Utility Bill / Bank Statement / Passport)\nPassport-size Photograph\nDate of Birth Proof (Birth Certificate / Passport / Matriculation Certificate)\nProof of NRI Status (if applicable – Passport + Visa/PIO/OCI copy)\n\nCOMPANY\nCertificate of Incorporation (COI)\nProof of Company Address (Utility Bill / Rent Agreement)\nAuthorization Letter from Director\nIdentity and Address Proof of Signatory (Director/Partner)"
            },
            {
                title: "PAN Registration (NRI)",
                price: 4999,
                tat: "1-2 days",
                documents: "Recent passport-sized photograph (two copies)\nPassport copy\nPIO or OCI card copy (if applicable)\nOverseas address proof (e.g., overseas bank statement or residential permit from Indian authorities)\nNRE bank account statement (if available) showing at least two transactions in the last six months, duly attested by Indian Embassy/Consulate/High Commission/Apostille or bank manager\nNote: Requirements for NRI documents are different, charges may vary accordingly.\nPlease specify if Resident Individual - different documentation applies."
            },
            {
                title: "IEC Certificate",
                price: 2999,
                tat: "2-3 days",
                documents: "PAN Card\nAadhaar Card\nPassport-size Photograph\nCancelled Cheque\nAddress Proof of Business\nDigital Signature Certificate"
            },
            {
                title: "DSC Signature",
                price: 2999,
                tat: "1-2 days",
                documents: "Passport-size Photograph\nPAN Card\nAadhaar Card\nEmail ID and Mobile Number\nIdentity Verification"
            },
            {
                title: "GST Registration",
                price: 4999,
                tat: "10 days",
                documents: "PAN Card of Business\nAadhaar Card\nPassport-size Photograph\nBusiness Address Proof\nUtility Bill\nBank Account Proof\nDigital Signature Certificate\nRent agreement with NOC"
            },
            {
                title: "Partnership firm registration, dissolution, addition, deletion",
                price: 9999,
                tat: "5-7 days",
                documents: "1. Partnership Firm Registration\nPartnership Deed (Notarized)- FORMAT AND Draft will provide\nPAN & Aadhaar of All Partners\nAddress Proof of Firm (Utility Bill / Rent Agreement / NOC)\nPassport-size Photos of Partners\nAffidavit (for name and business nature confirmation)\nProof of Principal Place of Business\n2. Addition of Partner\nAmended Partnership Deed (reflecting new partner)-will provide draft\nConsent Letter from New Partner\nPAN & Aadhaar of New Partner\nPassport-size Photo of New Partner\nAddress Proof of New Partner\nForm for Change in Constitution (State-specific)\n3. Deletion/Retirement of Partner\nReconstituted Partnership Deed-will provide draft\nConsent Letter/Retirement Deed\nForm for Change in Constitution (State-specific)\nPAN & Aadhaar of Retiring Partner\nBoard/Partner Resolution (if applicable)\n4. Dissolution of Partnership Firm\nDissolution Deed (signed by all partners)\nPAN of Firm & All Partners\nConsent Letter from Partners\nApplication for Dissolution (State-specific Form)\nFinal Account Statement\nAffidavit / Declaration for Closure"
            },
            {
                title: "RERA Agent Registration (Maharashtra)",
                price: 14999,
                tat: "5-7 days",
                documents: "PAN Card of the Agent (Individual or Company/Firm)\nAadhaar Card (for individuals or authorized person)\nPassport-size Photograph\nAddress Proof (Electricity Bill/Rent Agreement)\nIncome Tax Return (ITR) for last 3 years (if applicable)\nCopy of Partnership Deed or MOA/AOA and COI (for firms/companies)\nBoard Resolution/Authorization Letter (if company/LLP)\nDetails of All Past Real Estate Projects/Deals (if any)\nMobile Number and Email ID\nProof of Business Address (Rent Agreement/Ownership Proof)\nCopy of Business Registration Certificate (GST/Shop Act etc.)\nLetterhead and Stamp (optional, but often requested)"
            },
            {
                title: "RERA Project Registration (Maharashtra)",
                price: 49999,
                tat: "10-15 days",
                documents: "PAN Card of the Promoter/Developer\nAadhaar Card of the Promoter\nProject Land Title Deed and Legal Ownership Documents\nEncumbrance Certificate of the Land\nSanctioned Building Plan and Layout Plan (from competent authority)\nProject Commencement Certificate\nEstimated Project Cost and Timeline\nDetails of Past Projects (if any)\nDevelopment Agreement (if applicable)\nArchitect’s Certificate (project layout)\nEngineer’s Certificate (cost of construction estimate)                           CA Certificate (fund utilization and cost estimation)\nProject Location and Site Photographs\nDetails of Allottees (if any bookings done)\nDetails of Bank Account for Project (70% fund account)\nAffidavit cum Declaration (Form-B)\nParking Area Details (covered and open)\nLegal Title Report (by advocate)\nDetails of Real Estate Agents (if appointed)"
            },
            {
                title: "Startup India Registration",
                price: 4999,
                tat: "7-10 days",
                documents: "Certificate of Incorporation/Registration\nProof of funding (if any)\nWrite-up on nature of business/innovation\nEmail & Mobile Number\nPAN Card of Entity"
            },
            {
                title: "Legal Entity Identifier Code",
                price: 5999,
                tat: "2-3 days",
                documents: "Entity Registration Certificate\nPAN Card of Entity\nAuthorized Signatory Details\nBoard Resolution"
            },
            {
                title: "12A and 80G Registration",
                price: 14999,
                tat: "3-4 months",
                documents: "Trust Deed/MOA & AOA\nPAN of Entity\nActivity Report since inception\nBank Balance Sheet (Last 3 years)\nList of Trustees/Governing Body"
            },
            {
                title: "Darpan Registration",
                price: 2999,
                tat: "5-7 days",
                documents: "Entity Registration Certificate\nPAN Card of NGO\nDetails of 3 key office bearers\nAadhar & PAN of key members"
            },
            {
                title: "Trade License",
                price: 3499,
                tat: "15-20 days",
                documents: "Address Proof of Business\nID Proof of Owner\nProperty Tax Receipt\nNOC from neighbors (if applicable)"
            },
            {
                title: "ISO Registration",
                price: 7999,
                tat: "10-15 days",
                documents: "Business Registration Proof\nInvoices of Sales/Purchase\nScope of business\nOrganization Chart"
            },
            {
                title: "12A Registration",
                price: 8999,
                tat: "2-3 months",
                documents: "Trust Deed/Registration Certificate\nPAN of NGO\nFinancial Statements (last 3 years)"
            },
            {
                title: "80G Registration",
                price: 8999,
                tat: "2-3 months",
                documents: "Trust Deed/Registration Certificate\nPAN of NGO\nActivity Reports"
            },
            {
                title: "FSSAI Registration",
                price: 1999,
                tat: "5-7 days",
                documents: "Photo of Applicant\nID Proof (Aadhar/Voter ID)\nAddress Proof of Business\nList of food products"
            },
            {
                title: "FSSAI License",
                price: 9999,
                tat: "15-30 days",
                documents: "Blueprint of Processing Unit\nList of Machinery\nFood Safety Management System Plan\nAnalysis report of water"
            },
            {
                title: "Shop Act Registration",
                price: 2499,
                tat: "3-5 days",
                documents: "Photo of Establishment (with name board)\nID Proof of Owner\nAddress Proof\nRate Card/Menu (if applicable)"
            },
            {
                title: "APEDA Registration",
                price: 7499,
                tat: "7-10 days",
                documents: "IE Code Certificate\nBank Certificate\nCancelled Cheque\nMoA/AoA or Partnership Deed"
            },
            {
                title: "Drug License",
                price: 14999,
                tat: "30-45 days",
                documents: "Premises Plan\nOwnership/Rental Details\nPharmacist Details (Degree & Registration)\nAffidavit of Pharmacist"
            },
            {
                title: "Halal License & Certification",
                price: 19999,
                tat: "15-20 days",
                documents: "Business Registration\nFSSAI License\nList of Ingredients\nManufacturing Process Flow"
            },
            {
                title: "Barcode Registration",
                price: 8999,
                tat: "3-5 days",
                documents: "PAN of Entity\nAudited Financials (for turnover proof)\nProduct list"
            },
            {
                title: "Udyam Registration",
                price: 1499,
                tat: "1-2 days",
                documents: "Aadhar Card of Owner\nPAN Card of Entity\nBank Account Details\nInvestment & Turnover details"
            },
            {
                title: "ICEGATE Registration",
                price: 3999,
                tat: "2-3 days",
                documents: "IE Code\nDigital Signature\nPAN Card\nValid Email & Mobile"
            },
            {
                title: "RCMC Registration",
                price: 5999,
                tat: "10-15 days",
                documents: "IE Code Certificate\nPAN Card\nSME Registration (if any)\nMembership Application Form"
            },
            {
                title: "BIS Registration",
                price: 24999,
                tat: "30-60 days",
                documents: "Test Reports from BIS Lab\nManufacturing Unit Details\nAuthorized Signatory Details\nProduct Specification"
            },
            {
                title: "FCRA Registration",
                price: 29999,
                tat: "4-6 months",
                documents: "NGO Registration Proof\nActivity Logs\nForeign Funding Details\nAffidavit of all members"
            },
            {
                title: "TN RERA Registration for Agents",
                price: 12999,
                tat: "7-10 days",
                documents: "PAN & Aadhar of Agent\nAddress Proof\nRegistration fee payment proof\nPassport size photo"
            },
            {
                title: "Certificate of Incumbency",
                price: 4999,
                tat: "3-5 days",
                documents: "Company Incorporation Certificate\nRegister of Directors/Members\nBoard Resolution"
            },
            {
                title: "Fire License",
                price: 6999,
                tat: "15-20 days",
                documents: "Building Plan\nFire Safety Audit Report\nNOC from local fire department\nBuilding Completion Certificate"
            }
        ]
    },
    {
        category: "Startup & Advisory",
        services: [
            {
                title: "Business Structure Selection",
                price: 4999,
                tat: "1-2 days",
                documents: "Founders' PAN & Aadhar\nEducational qualifications\nBusiness model summary\nVision & mission statement"
            },
            {
                title: "Startup Certificate",
                price: 29999,
                tat: "5-10 days",
                documents: "Incorporation Certificate\nPAN Card of Entity\nDirectors/Partners Details\nBusiness Description\nAddress Proof\nMOA & AOA\nBank Account Details"
            },
            {
                title: "Proprietorship",
                price: 4999,
                tat: "3-5 days",
                documents: "PAN Card of Proprietor\nAadhaar Card\nAddress Proof\nBank Account Details\nBusiness Name & Activity"
            },
            {
                title: "Partnership",
                price: 9999,
                tat: "5-7 days",
                documents: "PAN & Aadhaar of All Partners\nPartnership Deed\nAddress Proof of Firm\nBank Account Details\nPassport-size Photos"
            },
            {
                title: "One Person Company",
                price: 14999,
                tat: "10-15 days",
                documents: "PAN & Aadhaar of Director & Nominee\nAddress Proof\nPassport-size Photos\nDigital Signature\nMOA & AOA"
            },
            {
                title: "Limited Liability Partnership",
                price: 14999,
                tat: "10-15 days",
                documents: "PAN & Aadhaar of Partners\nAddress Proof\nPassport-size Photos\nDigital Signature\nLLP Agreement"
            },
            {
                title: "Private Limited Company",
                price: 19999,
                tat: "10-15 days",
                documents: "PAN & Aadhaar of Directors\nAddress Proof\nPassport-size Photos\nDigital Signature (Class 2/3)\nMOA & AOA\nRent Agreement/NOC"
            },
            {
                title: "Section 8 Company",
                price: 24999,
                tat: "15-20 days",
                documents: "PAN & Aadhaar of Directors\nAddress Proof\nDigital Signature\nMOA & AOA (Non-profit objectives)\nList of Members\nDeclaration of Non-profit intent"
            },
            {
                title: "Trust Registration",
                price: 14999,
                tat: "10-15 days",
                documents: "PAN & Aadhaar of Trustees\nTrust Deed\nAddress Proof\nList of Trustees\nObjectives of Trust"
            },
            {
                title: "Public Limited Company",
                price: 49999,
                tat: "20-30 days",
                documents: "PAN & Aadhaar of Directors (min 7)\nAddress Proof\nDigital Signature\nMOA & AOA\nProspectus\nMinimum Capital Proof"
            },
            {
                title: "Producer Company",
                price: 34999,
                tat: "15-20 days",
                documents: "PAN & Aadhaar of Directors (min 5)\nAddress Proof\nDigital Signature\nMOA & AOA\nList of Producer Members\nActivity Details"
            },
            {
                title: "Indian Subsidiary",
                price: 39999,
                tat: "20-25 days",
                documents: "Parent Company Documents\nBoard Resolution\nPAN & Aadhaar of Indian Directors\nDigital Signature\nMOA & AOA\nFDI Compliance Documents"
            }
        ]
    },
    //Auditing Services
    // {
    //     category: "Auditing Services",
    //     services: [
    //         {
    //             title: "Internal Audit",
    //             price: "Charges on consultation",
    //             tat: "15 days minimum",
    //             documents: "Data in Electronic form"
    //         },
    //         {
    //             title: "Statutory Audit",
    //             price: "Charges on consultation",
    //             tat: "15-30 days",
    //             documents: "Data in Electronic form"
    //         },
    //         {
    //             title: "GST Audit (GSTR 9/9C)",
    //             price: "Charges on consultation",
    //             tat: "7-15 days",
    //             documents: "Data in Electronic form"
    //         },
    //         {
    //             title: "Inventory Audit",
    //             price: "Charges on consultation",
    //             tat: "7-15 days",
    //             documents: "Opening Stock Statement\nClosing Stock Statement\nStock Register (Item-wise and Location-wise)\nPhysical Verification Reports\nGoods Inward Register (Purchase Invoices)\nGoods Outward Register (Sales Invoices)\nMaterial Issue Slips / Gate Passes\nStock Movement Records (Intra-location transfers)\nBill of Materials (BOM)\nReorder Levels and Stock Valuation Method\nInventory Valuation Report (FIFO/Weighted Avg./Cost/NRV)\nDamaged/Obsolete Stock Reports\nStock Adjustment Entries (with reasons)\nGRN (Goods Receipt Notes)\nDelivery Challans\nWarehouse-wise stock summary\nStock Ageing Report\nPurchase Return & Sales Return records\nJob Work Inventory Details (Inward/Outward)\nWork-in-Progress (WIP) Register (for manufacturers)"
    //         }
    //     ]
    // },
    {
        category: "Certification Services",
        services: [
            {
                title: "Net Worth Certificate",
                price: 9999,
                tat: "1-3 days",
                documents: "PAN Card\nAadhaar Card\nLatest ITR\nBank Statements\nFD Statements\nProperty Documents\nLoan Statements\nBusiness Financial Statements"
            },
            {
                title: "Turnover Certificate",
                price: 4999,
                tat: "1-3 days",
                documents: "PAN Card\nGST Registration Certificate\nAudited Financial Statements\nIncome Tax Returns\nBank Statements\nSales Invoices"
            },
            {
                title: "15CA/15CB (FEMA Remittance)",
                price: 9999,
                tat: "7 days",
                documents: "PAN of Remitter\nPAN of Remittee\nInvoice or Agreement\nBank Details\nTax Residency Certificate"
            },
            {
                title: "Capital Contribution Certificate",
                price: 4999,
                tat: "1-3 days",
                documents: "PAN Card of Partners / Shareholders\nPartnership Deed / LLP Agreement / MOA & AOA\nBank Statements showing capital infusion\nAudited Financial Statements (if available)\nIncome Tax Returns (optional, for verification)"
            }
        ]
    },
    {
        category: "Project Services",
        services: [
            {
                title: "Project Reports",
                price: "₹25,000 or 2% of loan amount whichever is higher",
                tat: "5-10 days",
                documents: "Business Plan or Proposal\nPromoter/Director Profile and KYC Documents\nPAN and Aadhaar of Promoters\nCompany/Firm Registration Documents\nMOA & AOA / Partnership Deed / LLP Agreement\nLoan Repayment Schedule (if applicable)\nPast Financials (if existing business)\nBank Statements (last 6 months)\nDetails of Existing Loans (if any)\nLicenses/Approvals (if applicable)"
            }
        ]
    },
    {
        category: "Compliance",
        services: [
            {
                title: "PF Return Filing",
                price: 999,
                tat: "Monthly",
                documents: "Employee ECR details\nMonthly contribution data"
            },
            {
                title: "ESI Return Filing",
                price: 999,
                tat: "Monthly",
                documents: "Employee-wise ESI contribution data"
            },
            {
                title: "Professional Tax Return Filing",
                price: 999,
                tat: "Monthly/Annual",
                documents: "Employee salary details\nPT Deduction amount"
            },
            {
                title: "FDI Filing with RBI",
                price: 19999,
                tat: "15-20 days",
                documents: "FC-GPR Form details\nValuation Certificate\nFIRC Copy\nKYC of foreign investor"
            },
            {
                title: "FLA Return Filing",
                price: 4999,
                tat: "5-7 days",
                documents: "Audited Financial Statements\nPAN of Entity\nDetails of foreign assets/liabilities"
            },
            {
                title: "FSSAI Renewal",
                price: 2499,
                tat: "7-10 days",
                documents: "Original FSSAI License\nDeclaration Form\nAuthority Letter"
            },
            {
                title: "FSSAI Return Filing",
                price: 1999,
                tat: "3-5 days",
                documents: "Sales & Purchase details\nCategory of food products handled"
            },
            {
                title: "Partnership Compliance",
                price: 2999,
                tat: "5-7 days",
                documents: "Partnership Deed\nFinancial Statements\nPartner details"
            },
            {
                title: "Proprietorship Compliance",
                price: 2499,
                tat: "3-5 days",
                documents: "Proprietor PAN & Aadhar\nBank Statement\nSales/Purchase details"
            },
            {
                title: "Business Plan",
                price: 14999,
                tat: "10-15 days",
                documents: "Project Description\nPromoter details\nMarket analysis data\nFinancial projections"
            },
            {
                title: "PF Registration",
                price: 3999,
                tat: "7-10 days",
                documents: "PAN of Entity\nDigital Signature of Proprietor/Partner/Director\nCancelled Cheque\nAddress Proof"
            },
            {
                title: "ESI Registration",
                price: 3999,
                tat: "7-10 days",
                documents: "Registration Certificate\nPAN of Business\nList of Employees with joining dates\nBank Details"
            },
            {
                title: "Professional Tax Registration",
                price: 2999,
                tat: "3-5 days",
                documents: "PAN of Entity\nAddress Proof\nBank Account Details\nDetails of Employees"
            }
        ]
    }
];

export default function ClientServices() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedService, setExpandedService] = useState(null);
    const [expandedVariant, setExpandedVariant] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');

    const { toast } = useToast();
    const addItem = useCartStore((state) => state.addItem);
    const removeItem = useCartStore((state) => state.removeItem);
    const isInCart = useCartStore((state) => state.isInCart);
    const items = useCartStore((state) => state.items); // Subscribe to items for reactivity

    const toggleService = (categoryIndex, serviceIndex) => {
        const key = `${categoryIndex}-${serviceIndex}`;
        if (expandedService === key) {
            setExpandedService(null);
            setExpandedVariant(null);
        } else {
            setExpandedService(key);
            setExpandedVariant(null);
        }
    };

    const toggleVariant = (variantIndex) => {
        setExpandedVariant(expandedVariant === variantIndex ? null : variantIndex);
    };

    const handleAddToCart = (category, service, variant = null) => {
        if (isInCart(category, service.title, variant?.name)) {
            toast({
                title: "Already in cart",
                description: "This service is already in your cart.",
            });
            return;
        }

        const item = {
            service_id: getServiceId(service.title, variant?.name), // NEW: Get service ID
            category: category,
            title: service.title,
            price: service.price,
            tat: variant ? variant.tat : service.tat,
            variantName: variant ? variant.name : null,
        };

        addItem(item);

        toast({
            title: "Added to cart",
            description: variant
                ? `${service.title} - ${variant.name}`
                : service.title,
        });
    };

    const handleRemoveFromCart = (category, service, variant = null) => {
        const itemId = variant
            ? `${category}-${service.title}-${variant.name}`
            : `${category}-${service.title}`;

        removeItem(itemId);
        toast({
            title: "Removed from cart",
            description: variant
                ? `${service.title} - ${variant.name}`
                : service.title,
            variant: "destructive",
        });
    };

    const filteredServices = servicesData.map(category => ({
        ...category,
        services: category.services.filter(service =>
            service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.services.length > 0);

    const allCategories = ['all', ...servicesData.map(cat => cat.category)];

    const displayServices = activeCategory === 'all'
        ? filteredServices
        : filteredServices.filter(cat => cat.category === activeCategory);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Professional Services Catalog</h1>
                    <p className="text-muted-foreground mt-1">
                        Comprehensive financial and compliance services
                    </p>
                </div>
                <Badge variant="secondary" className="w-fit gap-1">
                    <BadgeCheck className="h-3 w-3" />
                    {filteredServices.reduce((acc, cat) => acc + cat.services.length, 0)} Services
                </Badge>
            </div>

            {/* Search Bar */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Category Tabs */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-muted/50 p-2">
                    {allCategories.map(category => (
                        <TabsTrigger
                            key={category}
                            value={category}
                            className="whitespace-nowrap"
                        >
                            {category === 'all' ? 'All Services' : category}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* Services Grid */}
            <div className="space-y-6">
                {displayServices.length === 0 ? (
                    <Card>
                        <CardContent className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground text-lg">No services found</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    displayServices.map((category, categoryIndex) => (
                        <motion.div
                            key={category.category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-semibold text-foreground">{category.category}</h2>
                                    <Badge variant="outline">{category.services.length}</Badge>
                                </div>

                                <div className="grid gap-4">
                                    {category.services.map((service, serviceIndex) => {
                                        const isExpanded = expandedService === `${categoryIndex}-${serviceIndex}`;
                                        const hasVariants = service.variants && service.variants.length > 0;

                                        return (
                                            <Card key={serviceIndex} className="overflow-hidden hover:shadow-md transition-shadow">
                                                <CardHeader className="pb-3 p-0">
                                                    <div className="flex items-start justify-between">
                                                        {/* Clickable Toggle Area (Left) */}
                                                        <div
                                                            className="flex-1 flex gap-4 p-6 cursor-pointer hover:bg-muted/30 transition-colors"
                                                            onClick={() => toggleService(categoryIndex, serviceIndex)}
                                                        >
                                                            <div className="mt-1">
                                                                {isExpanded ? (
                                                                    <ChevronUp className="h-5 w-5 text-primary" />
                                                                ) : (
                                                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <CardTitle className="text-lg">{service.title}</CardTitle>
                                                                {service.description && (
                                                                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                                                                )}
                                                                <div className="flex flex-wrap items-center gap-3 mt-3">
                                                                    {!hasVariants && service.tat && (
                                                                        <Badge variant="outline" className="gap-1">
                                                                            <Clock className="h-3 w-3" />
                                                                            {service.tat}
                                                                        </Badge>
                                                                    )}
                                                                    {hasVariants && (
                                                                        <Badge variant="outline" className="gap-1">
                                                                            {service.variants.length} Components
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Actions Area (Right) */}
                                                        <div className="flex items-center gap-6 p-6">
                                                            <div className="text-right">
                                                                <span className="text-lg font-bold text-primary flex items-center gap-1">
                                                                    <IndianRupee className="h-4 w-4" />
                                                                    {typeof service.price === 'number'
                                                                        ? service.price.toLocaleString('en-IN')
                                                                        : service.price}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Button
                                                                    variant={isInCart(category.category, service.title) ? "secondary" : "default"}
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        !isInCart(category.category, service.title) && handleAddToCart(category.category, service);
                                                                    }}
                                                                    className={cn("gap-2", isInCart(category.category, service.title) && "rounded-r-none border-r-0")}
                                                                >
                                                                    {isInCart(category.category, service.title) ? (
                                                                        <><Check className="h-4 w-4" /> In Cart</>
                                                                    ) : (
                                                                        <><ShoppingCart className="h-4 w-4" /> Add to Cart</>
                                                                    )}
                                                                </Button>
                                                                {isInCart(category.category, service.title) && (
                                                                    <Button
                                                                        variant="secondary"
                                                                        size="sm"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleRemoveFromCart(category.category, service);
                                                                        }}
                                                                        className="px-2 rounded-l-none border-l hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardHeader>

                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Separator />
                                                        <CardContent className="pt-4 space-y-4">
                                                            {hasVariants ? (
                                                                <div className="space-y-3">
                                                                    <p className="text-sm font-medium">Services you'll get</p>
                                                                    {service.variants.map((variant, variantIndex) => {
                                                                        const isVariantExpanded = expandedVariant === variantIndex;
                                                                        return (
                                                                            <Card key={variantIndex} className="border-l-4 border-l-primary/50">
                                                                                <CardHeader
                                                                                    className="pb-3 cursor-pointer hover:bg-muted/10 transition-colors"
                                                                                    onClick={() => toggleVariant(variantIndex)}
                                                                                >
                                                                                    <div className="flex items-start gap-3">
                                                                                        <div className="mt-0.5">
                                                                                            {isVariantExpanded ? (
                                                                                                <ChevronUp className="h-4 w-4 text-primary" />
                                                                                            ) : (
                                                                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="flex-1">
                                                                                            <p className="font-medium text-sm">{variant.name}</p>
                                                                                            {variant.tat && (
                                                                                                <Badge variant="outline" className="gap-1 mt-2">
                                                                                                    <Clock className="h-3 w-3" />
                                                                                                    {variant.tat}
                                                                                                </Badge>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                </CardHeader>
                                                                                {isVariantExpanded && (
                                                                                    <motion.div
                                                                                        initial={{ height: 0, opacity: 0 }}
                                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                                        transition={{ duration: 0.15 }}
                                                                                    >
                                                                                        <Separator />
                                                                                        <CardContent className="pt-3">
                                                                                            <div className="flex items-start gap-2">
                                                                                                <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                                                                                <div className="flex-1">
                                                                                                    <p className="text-xs font-medium mb-2">Required Documents:</p>
                                                                                                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                                                                                                        {variant.documents.split('\n').map((doc, idx) => (
                                                                                                            doc.trim() && <li key={idx}>{doc.trim()}</li>
                                                                                                        ))}
                                                                                                    </ul>
                                                                                                </div>
                                                                                            </div>
                                                                                        </CardContent>
                                                                                    </motion.div>
                                                                                )}
                                                                            </Card>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-start gap-2">
                                                                    <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                                                    <div>
                                                                        <p className="text-sm font-medium mb-2">Required Documents:</p>
                                                                        <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                                                                            {service.documents.split('\n').map((doc, idx) => (
                                                                                doc.trim() && <li key={idx}>{doc.trim()}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </CardContent>
                                                    </motion.div>
                                                )}
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
