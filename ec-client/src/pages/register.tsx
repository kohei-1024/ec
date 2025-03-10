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

const LoginLink = styled.p`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`;

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, error: authError } = useAuth();
  const router = useRouter();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { firstName, lastName, email, password, confirmPassword } = formData;
    
    // Simple validation
    if (!firstName || !lastName || !email || !password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      setFormError(null);
      
      await register({ firstName, lastName, email, password });
      
      // Redirect to home page after successful registration
      router.push('/');
    } catch (error: any) {
      setFormError(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <FormContainer>
        <FormTitle>Create Account</FormTitle>
        
        {(formError || authError) && (
          <ErrorMessage>
            {formError || authError}
          </ErrorMessage>
        )}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Enter your first name"
            />
          </FormGroup>
          
          <FormGroup>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Enter your last name"
            />
          </FormGroup>
          
          <FormGroup>
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Enter your email"
            />
          </FormGroup>
          
          <FormGroup>
            <TextField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Enter your password"
            />
          </FormGroup>
          
          <FormGroup>
            <TextField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Confirm your password"
            />
          </FormGroup>
          
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            variant="primary"
          >
            Create Account
          </Button>
        </form>
        
        <LoginLink>
          Already have an account? <Link href="/login">Log in</Link>
        </LoginLink>
      </FormContainer>
    </Layout>
  );
};

export default RegisterPage;