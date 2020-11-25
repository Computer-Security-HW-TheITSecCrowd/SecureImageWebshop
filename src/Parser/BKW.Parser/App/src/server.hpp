#include <iostream>
#include <memory>
#include <string>
#include <fstream>
#include <vector>
#include <algorithm>
#include <array>
#include <sstream>
#include <tuple>
#include <type_traits>

#include <grpcpp/grpcpp.h>

#include "animation.grpc.pb.h"
#include "parser.hpp"

using grpc::Server;
using grpc::ServerBuilder;
using grpc::ServerContext;
using grpc::Status;
using animation::IsValid;
using animation::RawAnimation;


class AnimationServiceImpl final : public animation::Parser::Service {
  Status Validate(ServerContext* context, const RawAnimation* request, IsValid* reply) override {
    std::cout << "rpc Validate" << std::endl;

    auto rawBytes = std::vector<uint8_t>();
    for (int i = 0; i < request->bytes_size(); i++) {
        rawBytes.push_back(static_cast<uint8_t>(request->bytes(i)));
    }

    auto [valid, anim, msg] = Parser::parse(rawBytes);

    std::cout << msg << std::endl;
    reply->set_value(valid);
    return Status::OK;
  }

  Status Parse(ServerContext* context, const RawAnimation* request, animation::Animation* reply) override {
    std::cout << "rpc Parse" << std::endl;

    auto rawBytes = std::vector<uint8_t>();
    for (int i = 0; i < request->bytes_size(); i++) {
        rawBytes.push_back(static_cast<uint8_t>(request->bytes(i)));
    }
    auto [valid, anim, msg] = Parser::parse(rawBytes);

    if (!valid) {
      return Status::OK;
    }

    // Add credits
    auto credits = reply->mutable_credits();
    credits->set_creator_name(anim.credits.creator.name);

    auto animDate = anim.credits.creationDateTime;
    auto date = credits->mutable_creation_date();
    date->set_year(animDate.year);
    date->set_month(animDate.month);
    date->set_day(animDate.day);
    date->set_hour(animDate.hour);
    date->set_minute(animDate.minute);

    for (auto animImg : anim.animationImages) {
      auto image = reply->add_images();

      image->set_duration(animImg.duration);
      image->set_width(animImg.image.width);
      image->set_height(animImg.image.height);
      image->set_caption(animImg.image.caption);

      for (auto tag : animImg.image.tags) {
        image->add_tags(tag);
      }

      for (auto pixel : animImg.image.pixels) {
        auto rgb = image->add_content();
        rgb->set_r(pixel.r);
        rgb->set_g(pixel.g);
        rgb->set_b(pixel.b);
      }
    }

    return Status::OK;
  }
};

void RunServer() {
  std::string server_address("0.0.0.0:50051");
  AnimationServiceImpl service;

  ServerBuilder builder;
  builder.AddListeningPort(server_address, grpc::InsecureServerCredentials());
  builder.RegisterService(&service);
  builder.SetMaxReceiveMessageSize(-1);
  
  std::unique_ptr<Server> server(builder.BuildAndStart());
  std::cout << "Server listening on " << server_address << std::endl;

  server->Wait();
}
