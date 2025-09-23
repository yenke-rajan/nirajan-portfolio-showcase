import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, Download, Trash } from 'lucide-react';

export function CVManager() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [cvFile, setCvFile] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentCV();
  }, []);

  const loadCurrentCV = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('cv-files')
        .list('', {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      if (data && data.length > 0) {
        setCvFile(data[0].name);
      }
    } catch (error) {
      console.error('Error loading CV:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('pdf')) {
      toast.error('Please upload a PDF file');
      return;
    }

    setUploading(true);

    try {
      // Delete existing CV if any
      if (cvFile) {
        await supabase.storage
          .from('cv-files')
          .remove([cvFile]);
      }

      // Upload new CV
      const fileName = `cv-${user?.id}-${Date.now()}.pdf`;
      const { error } = await supabase.storage
        .from('cv-files')
        .upload(fileName, file);

      if (error) throw error;

      setCvFile(fileName);
      toast.success('CV uploaded successfully!');
    } catch (error) {
      console.error('Error uploading CV:', error);
      toast.error('Failed to upload CV');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!cvFile) return;

    try {
      const { data, error } = await supabase.storage
        .from('cv-files')
        .download(cvFile);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CV.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Failed to download CV');
    }
  };

  const handleDelete = async () => {
    if (!cvFile) return;

    try {
      const { error } = await supabase.storage
        .from('cv-files')
        .remove([cvFile]);

      if (error) throw error;

      setCvFile(null);
      toast.success('CV deleted successfully!');
    } catch (error) {
      console.error('Error deleting CV:', error);
      toast.error('Failed to delete CV');
    }
  };

  const getPublicUrl = () => {
    if (!cvFile) return null;
    
    const { data } = supabase.storage
      .from('cv-files')
      .getPublicUrl(cvFile);
    
    return data.publicUrl;
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Upload CV (PDF only)</label>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={uploading}
            className="flex-1"
          />
          <Button disabled={uploading}>
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>

      {cvFile && (
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-medium mb-2">Current CV</h3>
          <p className="text-sm text-muted-foreground mb-4">
            File: {cvFile}
          </p>
          <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={handleDelete} variant="outline" size="sm">
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium mb-1">Public Download Link:</p>
            <code className="text-xs bg-background p-2 rounded border block">
              {getPublicUrl()}
            </code>
          </div>
        </div>
      )}
    </div>
  );
}