import { motion } from 'framer-motion';
import ServiceCard from './ServiceCard';

const ServiceGrid = ({ services }) => {
  const categories = [
    { key: 'billsRecharges', title: 'Bills & Recharges' },
    { key: 'financial', title: 'Financial Services' },
    { key: 'travel', title: 'Travel & Booking' },
    { key: 'entertainment', title: 'Entertainment' },
    { key: 'shopping', title: 'Shopping & More' },
  ];

  return (
    <div className="space-y-10">
      {categories.map((category, catIndex) => (
        <motion.div
          key={category.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + catIndex * 0.1 }}
        >
          <h2 className="font-grotesk text-xl font-bold text-white mb-5">
            {category.title}
          </h2>
          
          <div className="grid grid-cols-4 gap-x-4 gap-y-6">
            {services[category.key].map((service, index) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                index={index}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ServiceGrid;
