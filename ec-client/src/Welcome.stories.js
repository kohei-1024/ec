export default {
  title: 'Example/Welcome',
};

// Simple story that doesn't use JSX, just returns HTML
export const Welcome = () => {
  return {
    template: `
      <div style="margin: 2rem; padding: 2rem; border: 1px solid #ccc; border-radius: 4px;">
        <h1 style="color: #3f51b5; margin-bottom: 1rem;">Welcome to Storybook</h1>
        <p style="margin-bottom: 1rem;">This is a simple JavaScript story to verify that Storybook is working correctly.</p>
        <button style="background-color: #3f51b5; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer;">
          Click me
        </button>
      </div>
    `,
  };
};
