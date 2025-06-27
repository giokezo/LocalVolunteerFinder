 // Optional: for linking back
import '../App.css'; // Use existing styles for consistency

const CreatorsPage = () => {
  return (
    <div className="page-container">
      <h1>Meet the Team</h1>
      <p>
        Welcome to Volunteer Connect! This platform was built by a dedicated team of developers passionate about using technology to foster community spirit and facilitate social good. Our goal was to create a simple, intuitive, and beautiful place where people can find opportunities to make a real difference.
      </p>

      <h2 style={{ marginTop: '40px' }}>The Creators</h2>
      
      <div className="creator-profile">
        <h3>Giorgi Kezevadze</h3>
        <p>
          As a key architect of the project, Giorgi led the development of the robust backend systems. With a keen eye for solid and scalable server logic, he ensured that the application runs smoothly, securely, and efficiently. His work forms the invisible foundation that powers every search, signup, and user interaction on Volunteer Connect.
        </p>
      </div>

      <div className="creator-profile">
        <h3>Mikheil Mania</h3>
        <p>
          Mikheil was the creative force behind the user interface and frontend experience. He focused on building a clean, responsive, and engaging design that makes finding and joining volunteer opportunities effortless. Every button you click and every card you see was carefully crafted by Mikheil to be both functional and visually appealing.
        </p>
      </div>

      <p style={{ marginTop: '40px', textAlign: 'center', fontStyle: 'italic' }}>
        Thank you for using our platform. We hope it helps you connect with a cause you care about!
      </p>
    </div>
  );
};

// You can add some simple specific styles if you want
const styles = `
  .creator-profile {
    margin-top: 20px;
    padding: 20px;
    background: #f9fafb;
    border-left: 4px solid #3b82f6;
    border-radius: 8px;
  }
  .creator-profile h3 {
    margin-bottom: 8px;
    color: #1f2937;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


export default CreatorsPage;