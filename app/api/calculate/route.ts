import { NextResponse } from "next/server";

interface FinancialInput {
    salary: number;
    rate: number;
    tax: number;
    optionalCosts: number;
    initialAmount: number;
    time: number;
}

interface FinancialOutput {
    cumulativeProfitByPeriod: number[];
    profitByPeriod: number[];
    finalAmount: number;
    cumulativeCostsByPeriod: number[];
    costsByPeriod: number[];
    totalCostsPaid: number;
}

function calculateFinancialProfit(input: FinancialInput): FinancialOutput {
    const {
        salary,
        rate,
        tax,
        optionalCosts,
        initialAmount,
        time,
    } = input;

    const cumulativeProfitByPeriod: number[] = [];
    const cumulativeCostsByPeriod: number[] = [];
    const profitByPeriod: number[] = [];
    const costsByPeriod: number[] = [];

    let totalTaxRate = tax + optionalCosts;
    let annualSalaryTaxes = salary * totalTaxRate;
    let annualSalary = salary - annualSalaryTaxes;
    let totalAmount = initialAmount;
    let cumulativeCosts = 0;

    for (let i = 0; i < time; i++) {
        let annualCapitalGain = totalAmount * rate;
        let taxableCapitalGain = annualCapitalGain * 0.5;
        let capitalGainTaxes = taxableCapitalGain * tax;
        let netCapitalGain = annualCapitalGain - capitalGainTaxes;
        let costsPaid = annualSalaryTaxes + capitalGainTaxes;
        let totalAnnualGain = netCapitalGain + annualSalary;

        totalAmount += totalAnnualGain;
        cumulativeProfitByPeriod.push(totalAmount);
        cumulativeCostsByPeriod.push(cumulativeCosts);

        cumulativeCosts += costsPaid;
        profitByPeriod.push(totalAnnualGain);
        costsByPeriod.push(costsPaid);
    }

    return {
        cumulativeProfitByPeriod,
        profitByPeriod,
        finalAmount: totalAmount,
        cumulativeCostsByPeriod,
        costsByPeriod,
        totalCostsPaid: cumulativeCosts,
    };
}

export async function POST(request: Request) {
    try {
        const input: Partial<FinancialInput> = await request.json();

        // Destructure with defaults for optional values
        const {
            salary = 0,
            rate = 0.05,
            tax = 0.2,
            optionalCosts = 0,
            initialAmount = 0,
            time = 1,
        } = input;

        // Validate inputs
        if (
            typeof salary !== "number" ||
            typeof rate !== "number" ||
            typeof tax !== "number" ||
            typeof optionalCosts !== "number" ||
            typeof initialAmount !== "number" ||
            typeof time !== "number"
        ) {
            return NextResponse.json(
                {
                    error: `Invalid input. Expected numbers for all fields, but received: ${JSON.stringify(input)}`,
                },
                { status: 400 }
            );
        }

        const results = calculateFinancialProfit({
            salary,
            rate,
            tax,
            optionalCosts,
            initialAmount,
            time,
        });

        return NextResponse.json({ success: true, results });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error occurred while processing your request." },
            { status: 500 }
        );
    }
}
