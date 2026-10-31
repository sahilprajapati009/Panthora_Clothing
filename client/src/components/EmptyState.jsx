import { HiOutlineInbox } from 'react-icons/hi';

const EmptyState = ({ title = 'Nothing here', message = 'No items found.', icon: Icon }) => {
  const IconComponent = Icon || HiOutlineInbox;

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in" id="empty-state">
      <IconComponent className="w-12 h-12 text-border-light mb-4" />
      <h3 className="font-heading text-lg font-semibold text-text-secondary mb-1">{title}</h3>
      <p className="text-text-muted text-sm">{message}</p>
    </div>
  );
};

export default EmptyState;
