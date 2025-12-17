import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { addLead } from '../../shared/services/franchiseLeadService';


function FranchisePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [submitMessage, setSubmitMessage] = useState('');


  const handlePhoneClick = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:hamarasamachar62@gmail.com';
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, address } = formData;
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setSubmitMessage('कृपया सभी फ़ील्ड भरें');
      return;
    }

    try {
      setSubmitMessage('भेजा जा रहा है...');
      await addLead({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        source: 'franchise_page',
      });
      setSubmitMessage('अनुरोध प्राप्त हुआ! टीम आपसे शीघ्र संपर्क करेगी।');
      // Reset fields after a short acknowledgement
      setFormData({ name: '', phone: '', address: '' });
      setTimeout(() => setSubmitMessage(''), 4000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('त्रुटि हुई। कृपया पुनः प्रयास करें।');
      setTimeout(() => setSubmitMessage(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 sm:pb-24 page-transition">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-2.5 sm:px-3 py-2 sm:py-2.5 border-b border-gray-200" style={{ backgroundColor: '#E21E26' }}>
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:opacity-80 transition-opacity p-1 flex items-center justify-center"
          aria-label="Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-sm sm:text-base font-bold text-white">राजस्थान हेड फ्रेंचाइजी</h2>
        <div className="w-6 sm:w-8"></div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-5">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#E21E26] mb-3 sm:mb-4">
              राजस्थान हेड फ्रेंचाइजी
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Rajasthan Head Franchise
            </p>
          </div>

          {/* Main Franchise Information */}
          <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
            <div className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed space-y-3">
              <p>
                "हमारा समाचार" दैनिक समाचार पत्र की ओर से दिनांक 03/12/2025 से सम्पूर्ण राजस्थान स्टेट के लिए
                स्टेट फ्रेंचाइजी अधिकृत किया है जिसमें प्रबंधक ही सभी कार्य संभालेगा। "हमारा समाचार" की ओर से स्टेट
                फ्रेंचाइजी अधिकृत इसलिए किया गया है जिससे कि संपूर्ण राजस्थान में सभी जिलों व तहसील में
                "हमारा समाचार" समाचार पत्र के लिए प्रत्येक जिले में फ्रेंचाइजी दी जाएगी, जिसमें की एक
                सिक्योरिटी राशि होगी, जिस भी व्यक्ति को "हमारा समाचार" समाचार पत्र में जिले की फ्रेंचाइजी
                लेनी होगी वह एक तय सिक्योरिटी राशि मैनेजर को देकर जिले की फ्रेंचाइजी ले सकते है।
              </p>
              <p>
                इसी प्रकार जिले के फ्रेंचाइजी होल्डर को ये अधिकृत किया जाएगा कि वह अपने जिले की संपूर्ण
                तहसीलों में भी फ्रेंचाइजी दे सकेंगे, जिसमें की उनका भी कमीशन व जो भी तहसील वाले कार्य करेंगे
                उनमें से भी जिला फ्रेंचाइजी को भी प्रत्येक महीने आय मिलती रहेगी।
              </p>
              <p>
                स्टेट फ्रेंचाइजी की ओर से सभी जिला व तहसील फ्रेंचाइजी को कई प्रकार की योजनाओं में शामिल किया
                जाएगा व भविष्य में जिला व तहसील फ्रेंचाइजी के द्वारा एक टारगेट पूरा कर लेने पर स्टेट फ्रेंचाइजी
                की ओर से कई प्रकार की सुविधा भी दी जाएगी! जो निम्न प्रकार से है!
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">सुविधाएं एवं योजनाएं</h2>
            <div className="space-y-4 sm:space-y-5">
              {/* Benefit 1 */}
              <div className="bg-[#E21E26]/5 rounded-lg p-4 sm:p-5 border-l-4 border-[#E21E26]">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  1. कार्यालय खर्च एवं स्टाफ सैलरी
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  जिला फ्रेंचाइजी लेने वाले 3 माह के अंदर अपने जिले की सभी तहसीलों में फ्रेंचाइजी दे देते है व
                  जिले का राजस्व टारगेट प्रत्येक माह का 1 करोड़ देने लग जाते है तब जिला फ्रेंचाइजी के कार्यालय
                  का आधा खर्चा, स्टाफ में 2 स्टाफ की सैलरी में 10000/रुपए देना शुरू कर दिया जाएगा।
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-[#E21E26]/5 rounded-lg p-4 sm:p-5 border-l-4 border-[#E21E26]">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  2. एग्रीमेंट
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  जिला फ्रेंचाइजी लेने वाले व्यक्ति के साथ स्टेट फ्रेंचाइजी 500/रुपए के स्टांप पर एक एग्रीमेंट
                  साइन करेगी जिसमें सभी प्रकार की शर्ते व सुविधाएं लिखी होंगी।
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-[#E21E26]/5 rounded-lg p-4 sm:p-5 border-l-4 border-[#E21E26]">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  3. तहसील से कमीशन
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  जिला फ्रेंचाइजी के द्वारा अपनी सभी तहसीलों में फ्रेंचाइजी देने के बाद तहसील द्वारा जितना
                  बिजनेस दिया जाएगा उसका कुछ परसेंट जिला फ्रेंचाइजी को भी प्रत्येक महीने दिया जाएगा।
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="bg-[#E21E26]/5 rounded-lg p-4 sm:p-5 border-l-4 border-[#E21E26]">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  4. शपथ पत्र
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  जिला फ्रेंचाइजी से एक शपथ पत्र भी लिया जाएगा, जिसमें उनसे लिखवाया जाएगा कि फ्रेंचाइजी देने
                  वाले दिन से जिला फ्रेंचाइजी के द्वारा किसी भी प्रकार की असमाजिक, असंवैधानिक, या इलीगल
                  मामला पाया जाता है तब जिला फ्रेंचाइजी स्वत ही निरस्त मानी जाएगी।
                </p>
              </div>

              {/* Benefit 5 */}
              <div className="bg-[#E21E26]/5 rounded-lg p-4 sm:p-5 border-l-4 border-[#E21E26]">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  5. नियंत्रण एवं निरीक्षण
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  जिला फ्रेंचाइजी के द्वारा जितनी भी तहसील फ्रेंचाइजी है उन सभी पर जिला फ्रेंचाइजी का ही
                  नियंत्रण रहेगा, लेकिन स्टेट फ्रेंचाइजी कभी भी ओचक निरीक्षण कर सकती है।
                </p>
              </div>

              {/* Benefit 6 */}
              <div className="bg-[#E21E26]/5 rounded-lg p-4 sm:p-5 border-l-4 border-[#E21E26]">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  6. योजनाओं में शामिल
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  जिला व तहसील फ्रेंचाइजी को स्टेट फ्रेंचाइजी के द्वारा कई प्रकार की योजनाओं में शामिल किया
                  जाएगा।
                </p>
              </div>

              {/* Benefit 7 */}
              <div className="bg-[#E21E26]/5 rounded-lg p-4 sm:p-5 border-l-4 border-[#E21E26]">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  7. प्रिंट ऑथराइजेशन
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  जब जिला फ्रेंचाइजी के द्वारा अपनी संपूर्ण तहसीलों में फ्रेंचाइजी दे दी जाती है तब जिले में
                  (10000) के लगभग समाचार पत्र की प्रतियां पब्लिक में वितरित होने लग जाए तब स्टेट फ्रेंचाइजी
                  के द्वारा उस जिले में ही समाचार पत्र की प्रिंट के लिए ऑथराइज कर दिया जाएगा।
                </p>
              </div>
            </div>
          </div>

          {/* Manager Section */}
          <div className="bg-[#E21E26]/5 rounded-lg p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">मैनेजर</h2>
            <div className="text-sm sm:text-base text-gray-700">
              <p className="text-gray-600">राजस्थान हेड फ्रेंचाइजी मैनेजर</p>
            </div>
          </div>

          {/* Terms & Conditions - always visible */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 space-y-3 text-sm sm:text-base text-gray-800 leading-relaxed">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              फ्रेंचाइजी लेने के नियम व शर्तें
            </h3>
            <p className="font-medium text-gray-700">
              संपूर्ण राजस्थान में जिस किसी को जिला या तहसील में न्यूज व विज्ञापन फ्रेंचाइजी लेना है उनके लिए नियम व शर्तें:
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>जिला फ्रेंचाइजी की सिक्योरिटी राशि - 5 लाख</li>
              <li>तहसील फ्रेंचाइजी की सिक्योरिटी राशि - 1.50 लाख</li>
              <li>न्यूज व विज्ञापन फ्रेंचाइजी लेने के लिए 500/रुपए के स्टांप पर एग्रीमेंट होगा।</li>
              <li>जिला व तहसील फ्रेंचाइजी की सिक्योरिटी राशि रिफंड नहीं है।</li>
              <li>जिला फ्रेंचाइजी होल्डर को 3 माह में जिले की सभी तहसीलों की फ्रेंचाइजी दिलवानी है।</li>
              <li>जिला फ्रेंचाइजी होल्डर को हर तहसील फ्रेंचाइजी से ₹25,000 बतौर कमीशन मिलेगा।</li>
              <li>तहसील फ्रेंचाइजी देते समय सिक्योरिटी पहले लेकर राजस्थान हेड फ्रेंचाइजी में जमा कर रसीद दें; 500/रुपए स्टांप का एग्रीमेंट तहसील फ्रेंचाइजी से करवाकर प्रति कार्यालय में जमा करनी है।</li>
              <li>तहसील इनकम में से खर्च निकालकर 15% जिला फ्रेंचाइजी को व 10% राजस्थान हेड फ्रेंचाइजी को देना होगा।</li>
              <li>किसी भी असंवैधानिक/असमाजिक गतिविधि या केस दर्ज होने पर फ्रेंचाइजी स्वतः निरस्त मानी जाएगी।</li>
              <li>जिला: प्रतिदिन 5000 प्रतियां नगद (300 गिफ्ट), तहसील: प्रतिदिन 1000 प्रतियां नगद (100 गिफ्ट) लेनी होंगी।</li>
              <li>तहसील फ्रेंचाइजी 11,000/रुपए सिक्योरिटी लेकर मिनी फ्रेंचाइजी दे सकती है; यह राशि रिफंड नहीं होगी। मिनी फ्रेंचाइजी को रोज 50 प्रतियां नगद व 20 मुफ्त मिलेंगी; प्रति माह ₹2000 विज्ञापन देना अनिवार्य है।</li>
              <li>मिनी फ्रेंचाइजी राशि में से ₹7000 राजस्थान हेड, ₹2000 जिला फ्रेंचाइजी को, और ₹3000 तहसील फ्रेंचाइजी रखेगा।</li>
              <li>जिला/तहसील फ्रेंचाइजी एक वर्ष के लिए मान्य; अगले वर्ष पुनः सिक्योरिटी व औपचारिकता आवश्यक।</li>
              <li>विज्ञापन पर जिला फ्रेंचाइजी को 35% कमीशन; तहसील विज्ञापन पर जिला को 5% और तहसील को 35%। शेष तुरंत राजस्थान हेड को ट्रांसफर करें।</li>
              <li>मासिक न्यूनतम लक्ष्य: जिला ₹50,000 विज्ञापन, तहसील ₹21,000 विज्ञापन (मिनी फ्रेंचाइजी के ₹2000 के अतिरिक्त)।</li>
            </ol>
          </div>

          {/* Franchise lead form */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 md:p-6 mb-10 sm:mb-12 shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              फ्रेंचाइजी में रुचि दर्ज करें
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              अपना नाम, मोबाइल नंबर और पता भेजें। टीम आपसे शीघ्र संपर्क करेगी।
            </p>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  नाम *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E21E26] focus:border-[#E21E26]"
                  placeholder="अपना पूरा नाम"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  मोबाइल नंबर *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E21E26] focus:border-[#E21E26]"
                  placeholder="उदा: 98XXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  पता / जिला / तहसील *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  rows={3}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E21E26] focus:border-[#E21E26]"
                  placeholder="पूरा पता लिखें"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#E21E26] text-white font-semibold px-4 py-3 rounded-lg shadow hover:bg-[#c91b22] transition-colors"
              >
                अनुरोध भेजें
              </button>
              {submitMessage && (
                <p className="text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  {submitMessage}
                </p>
              )}
            </form>
          </div>

          {/* Contact Section */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5">संपर्क करें</h2>

            {/* Email */}
            <div className="bg-[#E21E26]/5 rounded-lg p-4 sm:p-5 mb-4 sm:mb-5">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">ईमेल</h3>
              <button
                onClick={handleEmailClick}
                className="flex items-center gap-2 text-[#E21E26] hover:text-[#C21A20] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-base sm:text-lg font-medium">hamarasamachar62@gmail.com</span>
              </button>
            </div>

            {/* Franchise Contact */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                Rajasthan head frenchise
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                Mobile number
              </p>
              <button
                onClick={() => handlePhoneClick('8824839740')}
                className="flex items-center gap-2 text-[#E21E26] hover:text-[#C21A20] transition-colors text-base sm:text-lg font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>8824839740</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navbar */}

    </div>
  );
}

export default FranchisePage;

