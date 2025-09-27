import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency_level: number;
  order_index: number;
}

const SkillsManager = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'technical',
    proficiency_level: 5
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id)
        .order('order_index');

      if (error) throw error;
      setSkills(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching skills",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addSkill = async () => {
    if (!newSkill.name.trim()) {
      toast({
        title: "Error",
        description: "Skill name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('skills')
        .insert({
          user_id: user.id,
          name: newSkill.name,
          category: newSkill.category,
          proficiency_level: newSkill.proficiency_level,
          order_index: skills.length
        });

      if (error) throw error;

      setNewSkill({ name: '', category: 'technical', proficiency_level: 5 });
      fetchSkills();
      
      toast({
        title: "Success",
        description: "Skill added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error adding skill",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchSkills();
      toast({
        title: "Success",
        description: "Skill deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting skill",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'creative':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'language':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'soft':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Skill */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Skill name"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
          />
          
          <Select
            value={newSkill.category}
            onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="language">Language</SelectItem>
              <SelectItem value="soft">Soft Skills</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={newSkill.proficiency_level.toString()}
            onValueChange={(value) => setNewSkill({ ...newSkill, proficiency_level: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Beginner (1)</SelectItem>
              <SelectItem value="2">Basic (2)</SelectItem>
              <SelectItem value="3">Intermediate (3)</SelectItem>
              <SelectItem value="4">Advanced (4)</SelectItem>
              <SelectItem value="5">Expert (5)</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={addSkill} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>

        {/* Skills List */}
        <div className="space-y-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-card"
            >
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">{skill.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getCategoryColor(skill.category)}>
                      {skill.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Level {skill.proficiency_level}/5
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteSkill(skill.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {skills.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No skills added yet. Add your first skill above.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsManager;