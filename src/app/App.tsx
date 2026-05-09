import { MemoryRouter, Routes, Route } from "react-router";
import { MembershipProvider } from "./contexts/MembershipContext";
import { PlanProvider } from "./contexts/PlanContext";
import { Toaster } from "sonner";
import { SplashPage } from "./pages/SplashPage";
import { LoginPage } from "./pages/LoginPage";
import { PhoneLoginPage } from "./pages/PhoneLoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AiHomePage } from "./pages/AiHomePage";
import { ExpertsPage } from "./pages/ExpertsPage";
import { ExpertDetailPage } from "./pages/ExpertDetailPage";
import { ConversationsPage } from "./pages/ConversationsPage";
import { ChatPage } from "./pages/ChatPage";
import { VoiceCallPage } from "./pages/VoiceCallPage";
import { LecturesPage } from "./pages/LecturesPage";
import { PodcastPlayerPage } from "./pages/PodcastPlayerPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProfileEditPage } from "./pages/ProfileEditPage";
import { MemoryPage } from "./pages/MemoryPage";
import { AddMemoryPage } from "./pages/AddMemoryPage";
import { EditMemoryPage } from "./pages/EditMemoryPage";
import { FontSettingsPage } from "./pages/FontSettingsPage";
import { VoiceSettingsPage } from "./pages/VoiceSettingsPage";
import { KnowledgePage } from "./pages/KnowledgePage";
import { SafetyPage } from "./pages/SafetyPage";
import { BooksPage } from "./pages/BooksPage";
import { BooksLecturesPage } from "./pages/BooksLecturesPage";
import { ZhiyinPage } from "./pages/ZhiyinPage";
import { PostDetailPage } from "./pages/PostDetailPage";
import { MessageHistoryPage } from "./pages/MessageHistoryPage";
import { SharedConversationPage } from "./pages/SharedConversationPage";
import { CheckInPage } from "./pages/CheckInPage";
import { OrderDetailPage } from "./pages/OrderDetailPage";
import { AddressSettingsPage } from "./pages/AddressSettingsPage";
import { PointsDetailPage } from "./pages/PointsDetailPage";
import { PlanUpdateTestPage } from "./pages/PlanUpdateTestPage";

function App() {
  return (
    <PlanProvider>
      <MembershipProvider>
        <MemoryRouter initialEntries={["/"]} initialIndex={0}>
        <Routes>
          <Route path="/splash" element={<SplashPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/phone-login" element={<PhoneLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<AiHomePage />} />
          <Route path="/experts" element={<ExpertsPage />} />
          <Route path="/expert/:id" element={<ExpertDetailPage />} />
          <Route path="/conversations" element={<ConversationsPage />} />
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="/call/:id" element={<VoiceCallPage />} />
          <Route path="/lectures" element={<LecturesPage />} />
          <Route path="/podcast/:style" element={<PodcastPlayerPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/memory" element={<MemoryPage />} />
          <Route path="/memory/add" element={<AddMemoryPage />} />
          <Route path="/memory/edit/:memoryId" element={<EditMemoryPage />} />
          <Route path="/settings/font" element={<FontSettingsPage />} />
          <Route path="/settings/voice" element={<VoiceSettingsPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books-lectures" element={<BooksLecturesPage />} />
          <Route path="/checkin" element={<CheckInPage />} />
          <Route path="/zhiyin" element={<ZhiyinPage />} />
          <Route path="/zhiyin/post/:postId" element={<PostDetailPage />} />
          <Route path="/zhiyin/messages" element={<MessageHistoryPage />} />
          <Route path="/shared-conversation" element={<SharedConversationPage />} />
          <Route path="/checkin/order/:orderId" element={<OrderDetailPage />} />
          <Route path="/checkin/address-settings" element={<AddressSettingsPage />} />
          <Route path="/checkin/points-detail" element={<PointsDetailPage />} />
          <Route path="/test-plan-update" element={<PlanUpdateTestPage />} />
        </Routes>
      </MemoryRouter>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            fontSize: '16px',
            padding: '16px 20px',
            borderRadius: '16px',
            backdropFilter: 'blur(12px)',
          },
          className: 'glass-card',
        }}
      />
      </MembershipProvider>
    </PlanProvider>
  );
}

export { App };
export default App;