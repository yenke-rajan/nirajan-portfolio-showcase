import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency_level: number;
  order_index: number;
}

export default function SkillsManager() {
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
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (error: any) {
      console.error('Error fetching skills:', error);
      toast({
        title: "Error",
        description: "Failed to fetch skills",
        variant: "destructive",
      });
    }
  };

  const addSkill = async () => {
    if (!newSkill.name.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('skills')
        .insert({
          user_id: user.id,
          name: newSkill.name.trim(),
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
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill",
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
      console.error('Error deleting skill:', error);
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills Management</CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage skills that appear in the "Interests & Expertise" section
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Skill */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-medium">Add New Skill</h3>
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="language">Language</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={newSkill.proficiency_level.toString()}
              onValueChange={(value) => setNewSkill({ ...newSkill, proficiency_level: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Beginner</SelectItem>
                <SelectItem value="3">Intermediate</SelectItem>
                <SelectItem value="5">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addSkill} disabled={loading || !newSkill.name.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Skills List */}
        <div className="space-y-4">
          <h3 className="font-medium">Current Skills</h3>
          {skills.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No skills added yet</p>
          ) : (
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{skill.name}</span>
                    <Badge variant="secondary">{skill.category}</Badge>
                    <Badge variant="outline">
                      {skill.proficiency_level === 1 ? 'Beginner' : 
                       skill.proficiency_level === 3 ? 'Intermediate' : 'Advanced'}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteSkill(skill.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}