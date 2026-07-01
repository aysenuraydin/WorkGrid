using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using workgrid.Infrastructure.Identity;
namespace workgrid.Infrastructure.Persistence.Configurations;

public class UserFriendConfiguration : IEntityTypeConfiguration<UserFriend>
{
    public void Configure(EntityTypeBuilder<UserFriend> builder)
    {
        builder.ToTable("UserFriends", "USR");

        builder.HasKey(uf => new { uf.UserId, uf.FriendId });

        builder.HasOne(uf => uf.User)
            .WithMany(u => u.SentFriendRequests)
            .HasForeignKey(uf => uf.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(uf => uf.Friend)
            .WithMany(u => u.ReceivedFriendRequests)
            .HasForeignKey(uf => uf.FriendId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}