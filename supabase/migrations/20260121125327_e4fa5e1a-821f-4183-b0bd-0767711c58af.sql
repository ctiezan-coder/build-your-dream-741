-- Create simulations history table
CREATE TABLE public.simulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  product JSONB NOT NULL,
  params JSONB NOT NULL,
  breakdown JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own simulations" 
ON public.simulations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own simulations" 
ON public.simulations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own simulations" 
ON public.simulations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_simulations_user_id ON public.simulations(user_id);
CREATE INDEX idx_simulations_created_at ON public.simulations(created_at DESC);