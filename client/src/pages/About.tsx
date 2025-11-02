import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Building2, Calendar, FileText, Users } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12">
        <div className="container px-4 mx-auto md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="mb-4 text-4xl font-bold text-foreground font-display">
                About WARN Notices
              </h1>
              <p className="text-xl text-muted-foreground">
                Understanding the Worker Adjustment and Retraining Notification Act
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    What is the WARN Act?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    The Worker Adjustment and Retraining Notification (WARN) Act is a federal law that protects workers, their families, and communities by requiring employers to provide advance notice of plant closings and mass layoffs.
                  </p>
                  <p>
                    Enacted in 1988, the WARN Act ensures that workers receive at least 60 days advance notice before a facility closure or mass layoff, giving them time to prepare for the transition, seek alternative employment, or pursue training opportunities.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Who Must Comply?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    The WARN Act applies to employers with 100 or more employees, not counting those who have worked less than six months in the last 12 months and those who work an average of fewer than 20 hours per week.
                  </p>
                  <p className="font-medium text-foreground">
                    Covered Events Include:
                  </p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>
                      <strong>Plant Closings:</strong> Permanent or temporary shutdown of a single site that results in job loss for 50 or more employees during any 30-day period
                    </li>
                    <li>
                      <strong>Mass Layoffs:</strong> Reduction in force resulting in job loss at a single site for at least 500 employees, or 50-499 employees if they make up at least 33% of the workforce
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Who Receives Notice?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    Employers must provide written notice to:
                  </p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>Affected workers or their representatives (union)</li>
                    <li>The state's dislocated worker unit</li>
                    <li>The chief elected official of local government</li>
                  </ul>
                  <p>
                    These notices become public records and are often published on state workforce websites, which is where we aggregate this data to provide you with comprehensive tracking across the United States.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Important Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    When reviewing WARN notices on this platform, you'll see two key dates:
                  </p>
                  <ul className="space-y-3 ml-6 list-disc">
                    <li>
                      <strong>Filing Date:</strong> The date the WARN notice was submitted to state authorities. This is when the employer officially notified the government of the planned action.
                    </li>
                    <li>
                      <strong>Effective Date:</strong> The anticipated date when the layoffs or closure will take effect. This is typically at least 60 days after the filing date, as required by law.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    Why This Matters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    WARN notices provide critical early warning signals about economic shifts, industry trends, and regional employment changes. By tracking these notices, you can:
                  </p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>Stay informed about job market conditions in your area</li>
                    <li>Identify industries experiencing growth or decline</li>
                    <li>Understand regional economic trends</li>
                    <li>Prepare for potential career transitions</li>
                    <li>Support affected workers and communities</li>
                  </ul>
                  <p className="mt-4">
                    Our platform aggregates WARN notices from state workforce agencies across the country, providing a centralized view of employment changes nationwide. We update our database regularly to ensure you have access to the latest information.
                  </p>
                </CardContent>
              </Card>

              <div className="p-6 rounded-lg bg-muted/50">
                <h3 className="mb-2 font-semibold text-foreground">Data Sources</h3>
                <p className="text-sm text-muted-foreground">
                  All data on this platform is sourced from official state workforce agency WARN notice databases and public records. We do not create, modify, or interpret the data—we simply aggregate and present it in an accessible format. For official information or legal questions about WARN notices, please contact your state's workforce agency or the U.S. Department of Labor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
