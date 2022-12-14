package com.example.websocketi.repository.crudRepository;

import java.util.List;
import com.example.websocketi.model.Client;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface ClientCrudRepository extends CrudRepository<Client,Integer> {

    @Query("SELECT c FROM Client AS c WHERE c.usuario =:user AND c.password =:password")
    public Client getUser(String user, String password);

    @Query("SELECT c FROM Client AS c WHERE c.usuario LIKE :user")
    public  List<Client> getUserClient(String user);
    
}