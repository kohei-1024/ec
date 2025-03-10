import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { Layout } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';

const FormContainer = styled.div`
  max-width: 450px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const FormTitle = styled.h1`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const SignUpLink = styled.p`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, error: authError } = useAuth();
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      setFormError(null);
      
      await login({ email, password });
      
      // Redirect to home page after successful login
      router.push('/');
    } catch (error) {
      setFormError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <FormContainer>
        <FormTitle>Login</FormTitle>
        
        {(formError || authError) && (
          <ErrorMessage>
            {formError || authError}
          </ErrorMessage>
        )}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              placeholder="Enter your email"
            />
          </FormGroup>
          
          <FormGroup>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              placeholder="Enter your password"
            />
          </FormGroup>
          
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            variant="primary"
          >
            Login
          </Button>
        </form>
        
        <SignUpLink>
          Don't have an account? <Link href="/register">Sign up</Link>
        </SignUpLink>
      </FormContainer>
    </Layout>
  );
};

export default LoginPage;