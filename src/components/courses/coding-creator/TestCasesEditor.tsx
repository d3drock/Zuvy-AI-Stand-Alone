
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2 } from 'lucide-react';

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface TestCasesEditorProps {
  testCases: TestCase[];
  onTestCaseChange: (testCaseId: string, field: string, value: string | boolean) => void;
  onAddTestCase: () => void;
  onRemoveTestCase: (testCaseId: string) => void;
}

const TestCasesEditor = ({ 
  testCases, 
  onTestCaseChange, 
  onAddTestCase, 
  onRemoveTestCase 
}: TestCasesEditorProps) => {
  return (
    <AccordionItem value="test-cases">
      <Card>
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <CardTitle className="text-lg">Test Cases</CardTitle>
        </AccordionTrigger>
        <AccordionContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Define input/output pairs to validate solutions
                </p>
                <Button variant="outline" size="sm" onClick={onAddTestCase}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Test Case
                </Button>
              </div>

              <div className="space-y-4">
                {testCases.map((testCase, index) => (
                  <Card key={testCase.id} className="border-dashed">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-sm">
                          Test Case {index + 1}
                          {testCase.isHidden && (
                            <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">Hidden</span>
                          )}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onTestCaseChange(testCase.id, 'isHidden', !testCase.isHidden)}
                          >
                            {testCase.isHidden ? 'Make Visible' : 'Make Hidden'}
                          </Button>
                          {testCases.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveTestCase(testCase.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Input</Label>
                          <Textarea
                            placeholder="Enter test input..."
                            value={testCase.input}
                            onChange={(e) => onTestCaseChange(testCase.id, 'input', e.target.value)}
                            className="min-h-[80px] font-mono text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Expected Output</Label>
                          <Textarea
                            placeholder="Enter expected output..."
                            value={testCase.expectedOutput}
                            onChange={(e) => onTestCaseChange(testCase.id, 'expectedOutput', e.target.value)}
                            className="min-h-[80px] font-mono text-sm"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
};

export default TestCasesEditor;
